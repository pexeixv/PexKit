import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">PexKit</CardTitle>
          <CardDescription className="">MY personal productivity toolkit</CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <Button onClick={handleSignIn} className="w-full cursor-pointer" size="lg">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
