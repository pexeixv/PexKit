import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoadingPage from '@/pages/Loading'

const BaseLayout = lazy(() => import('@/components/BaseLayout'))
const ProtectedRoute = lazy(() =>
  import('@/components/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute }))
)
const NotFound = lazy(() => import('@/pages/NotFound'))
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const TodoPage = lazy(() => import('@/pages/Todo'))

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<BaseLayout disableHeader disableFooter />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/todo" element={<TodoPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
