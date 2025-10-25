import { useMemo } from 'react'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import type { Todo } from '../types'
import { isAfter, startOfDay } from 'date-fns'

interface TodoStatsProps {
  todos: Todo[]
}

export function TodoStats({ todos }: TodoStatsProps) {
  const stats = useMemo(() => {
    const now = startOfDay(new Date())

    return {
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
      overdue: todos.filter((t) => !t.completed && t.dueDate && isAfter(now, new Date(t.dueDate)))
        .length,
    }
  }, [todos])

  const statCards = [
    { label: 'Total', value: stats.total, icon: Circle, color: 'text-blue-500' },
    { label: 'Active', value: stats.active, icon: Clock, color: 'text-yellow-500' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
