import { useState, useEffect } from 'react'
import {
  type User,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('Signed in via redirect:', result.user.email)
        }
      })
      .catch((error) => {
        console.error('Redirect error:', error)
      })

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      // Use redirect instead of popup for production
      await signInWithRedirect(auth, googleProvider)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  }
}
