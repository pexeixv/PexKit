import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Demo from '@/pages/Demo'
import NotFound from '@/pages/NotFound'
import BaseLayout from '@/components/BaseLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/demo" element={<Demo />} />
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<BaseLayout disableHeader disableFooter />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
