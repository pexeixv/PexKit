import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, ListTodo } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Get user initials
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">PexKit</h1>
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(user?.displayName)}
              </div>
            )}
            <span className="text-sm text-gray-600">{user?.displayName || user?.email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ListTodo className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Todo List</h2>
            </div>
            <p className="text-gray-600 text-sm">Manage your tasks with priorities and due dates</p>
          </div>
        </div>
      </main>
    </div>
  )
}
