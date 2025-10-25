import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ListTodo } from 'lucide-react'

export function Dashboard() {
  return (
    <div className="">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <ListTodo className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Todo List</CardTitle>
                <CardDescription>Manage your tasks with priorities and due dates</CardDescription>
              </div>
            </CardHeader>
            <CardContent>{/* optional: additional controls or details */}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
