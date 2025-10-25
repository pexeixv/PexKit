import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Demo from '@/pages/Demo'
import NotFound from '@/pages/NotFound'
import BaseLayout from '@/components/BaseLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { useAuth } from '@/hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes with layout */}
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
      </Route>

      {/* Auth routes without header/footer */}
      <Route element={<BaseLayout disableHeader disableFooter />}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      </Route>

      {/* Protected routes with layout */}
      <Route element={<BaseLayout />}>
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
