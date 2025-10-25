import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/pages/Loading'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
