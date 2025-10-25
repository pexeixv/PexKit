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
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import type { Todo, TodoInput } from '@/pages/Todo/types'

export function useTodos() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTodos([])
      setLoading(false)
      return
    }

    const todosRef = collection(db, 'todos')
    const q = query(todosRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const todosData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            completedAt: data.completedAt?.toDate?.()?.toISOString() || undefined,
            dueDate: data.dueDate?.toDate?.()?.toISOString() || undefined,
          } as Todo
        })
        setTodos(todosData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching todos:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addTodo = async (todoData: TodoInput) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const todosRef = collection(db, 'todos')

      // Remove undefined fields
      const cleanData: any = {
        userId: user.uid,
        title: todoData.title,
        completed: todoData.completed,
        priority: todoData.priority,
        tags: todoData.tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Only add optional fields if they exist
      if (todoData.description) {
        cleanData.description = todoData.description
      }
      if (todoData.dueDate) {
        cleanData.dueDate = Timestamp.fromDate(new Date(todoData.dueDate))
      }

      await addDoc(todosRef, cleanData)
    } catch (err: any) {
      console.error('Error adding todo:', err)
      throw err
    }
  }

  const updateTodo = async (id: string, updates: Partial<TodoInput>) => {
    try {
      const todoRef = doc(db, 'todos', id)

      // Remove undefined fields
      const cleanUpdates: any = {
        updatedAt: serverTimestamp(),
      }

      // Only add fields that are defined
      if (updates.title !== undefined) cleanUpdates.title = updates.title
      if (updates.completed !== undefined) cleanUpdates.completed = updates.completed
      if (updates.priority !== undefined) cleanUpdates.priority = updates.priority
      if (updates.tags !== undefined) cleanUpdates.tags = updates.tags
      if (updates.description !== undefined) {
        cleanUpdates.description = updates.description || null // Use null instead of undefined
      }
      if (updates.dueDate !== undefined) {
        cleanUpdates.dueDate = updates.dueDate
          ? Timestamp.fromDate(new Date(updates.dueDate))
          : null
      }

      await updateDoc(todoRef, cleanUpdates)
    } catch (err: any) {
      console.error('Error updating todo:', err)
      throw err
    }
  }

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, 'todos', id)
      await updateDoc(todoRef, {
        completed,
        completedAt: completed ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      })
    } catch (err: any) {
      console.error('Error toggling todo:', err)
      throw err
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const todoRef = doc(db, 'todos', id)
      await deleteDoc(todoRef)
    } catch (err: any) {
      console.error('Error deleting todo:', err)
      throw err
    }
  }

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
  }
}
