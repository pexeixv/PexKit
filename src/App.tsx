import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '@/pages/NotFound'
import BaseLayout from '@/components/BaseLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import TodoPage from '@/pages/Todo'
import BirthdaysPage from '@/pages/Birthdays'

function App() {
  return (
    <Routes>
      <Route element={<BaseLayout disableHeader disableFooter />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/birthdays" element={<BirthdaysPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
