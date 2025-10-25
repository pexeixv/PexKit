import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoadingPage from '@/pages/Loading'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingPage />

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
