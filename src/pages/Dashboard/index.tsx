import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cake, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'

const apps = [
  {
    id: 'todo',
    title: 'Todo List',
    description: 'Manage your tasks with priorities and due dates',
    icon: <ListTodo className="size-6" />,
    link: '/todo',
  },
  {
    id: 'birthday',
    title: 'Birthdays',
    description: 'Never forget important birthdays with reminders and calendar views',
    icon: <Cake className="size-6" />,
    link: '/birthdays',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Track project progress and milestones',
    icon: <ListTodo className="size-6" />,
    link: '/todo',
  },
]

export function Dashboard() {
  return (
    <div className="">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((card) => (
            <Link to={card.link} key={card.id}>
              <Card
                key={card.id}
                className="rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-muted">{card.icon}</div>
                  <div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>{/* optional: additional controls or details */}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
