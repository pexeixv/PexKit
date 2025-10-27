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
import type { Birthday, BirthdayInput } from '../types'

export function useBirthdays() {
  const { user } = useAuth()
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setBirthdays([])
      setLoading(false)
      return
    }

    const birthdaysRef = collection(db, 'birthdays')
    const q = query(birthdaysRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const birthdaysData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as Birthday
        })
        setBirthdays(birthdaysData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching birthdays:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addBirthday = async (birthdayData: BirthdayInput) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const birthdaysRef = collection(db, 'birthdays')

      const cleanData: any = {
        userId: user.uid,
        name: birthdayData.name,
        birthMonth: birthdayData.birthMonth,
        birthDay: birthdayData.birthDay,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      if (birthdayData.birthYear) {
        cleanData.birthYear = birthdayData.birthYear
      }
      if (birthdayData.notes) {
        cleanData.notes = birthdayData.notes
      }

      await addDoc(birthdaysRef, cleanData)
    } catch (err: any) {
      console.error('Error adding birthday:', err)
      throw err
    }
  }

  const updateBirthday = async (id: string, updates: Partial<BirthdayInput>) => {
    try {
      const birthdayRef = doc(db, 'birthdays', id)

      const cleanUpdates: any = {
        updatedAt: serverTimestamp(),
      }

      if (updates.name !== undefined) cleanUpdates.name = updates.name
      if (updates.birthMonth !== undefined) cleanUpdates.birthMonth = updates.birthMonth
      if (updates.birthDay !== undefined) cleanUpdates.birthDay = updates.birthDay

      if (updates.birthYear !== undefined) {
        cleanUpdates.birthYear = updates.birthYear || null
      }
      if (updates.notes !== undefined) {
        cleanUpdates.notes = updates.notes || null
      }

      await updateDoc(birthdayRef, cleanUpdates)
    } catch (err: any) {
      console.error('Error updating birthday:', err)
      throw err
    }
  }

  const deleteBirthday = async (id: string) => {
    try {
      const birthdayRef = doc(db, 'birthdays', id)
      await deleteDoc(birthdayRef)
    } catch (err: any) {
      console.error('Error deleting birthday:', err)
      throw err
    }
  }

  return {
    birthdays,
    loading,
    error,
    addBirthday,
    updateBirthday,
    deleteBirthday,
  }
}
