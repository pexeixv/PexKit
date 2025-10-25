import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function Login() {
  const { signInWithGoogle, user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PexKit</h1>
          <p className="text-gray-600">Your personal productivity toolkit</p>
        </div>

        <Button onClick={handleSignIn} className="w-full" size="lg">
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
