import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import type { Group, GroupInput } from '../types'

const DEFAULT_GROUPS: Omit<GroupInput, 'userId'>[] = [
  { name: 'Family', color: '#3b82f6' },
  { name: 'Friends', color: '#10b981' },
  { name: 'Colleagues', color: '#8b5cf6' },
]

export function useGroups() {
  const { user } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setGroups([])
      setLoading(false)
      return
    }

    const groupsRef = collection(db, 'groups')
    const q = query(groupsRef, where('userId', '==', user.uid), orderBy('createdAt', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const groupsData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as Group
        })

        if (groupsData.length === 0) {
          try {
            for (const defaultGroup of DEFAULT_GROUPS) {
              await addDoc(groupsRef, {
                ...defaultGroup,
                userId: user.uid,
                createdAt: serverTimestamp(),
              })
            }
          } catch (err) {
            console.error('Error creating default groups:', err)
          }
        } else {
          setGroups(groupsData)
          setLoading(false)
        }
      },
      (err) => {
        console.error('Error fetching groups:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addGroup = async (groupData: GroupInput) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const groupsRef = collection(db, 'groups')
      await addDoc(groupsRef, {
        ...groupData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      })
    } catch (err: any) {
      console.error('Error adding group:', err)
      throw err
    }
  }

  const updateGroup = async (id: string, updates: Partial<GroupInput>) => {
    try {
      const groupRef = doc(db, 'groups', id)
      await updateDoc(groupRef, updates)
    } catch (err: any) {
      console.error('Error updating group:', err)
      throw err
    }
  }

  const deleteGroup = async (id: string) => {
    try {
      const groupRef = doc(db, 'groups', id)
      await deleteDoc(groupRef)
    } catch (err: any) {
      console.error('Error deleting group:', err)
      throw err
    }
  }

  return {
    groups,
    loading,
    error,
    addGroup,
    updateGroup,
    deleteGroup,
  }
}
