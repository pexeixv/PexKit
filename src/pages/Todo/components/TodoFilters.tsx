import { useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { filterAtom } from '../atoms'
import type { TodoFilter } from '../types'
import { List, Circle, CheckCircle2, AlertCircle, Calendar, CalendarDays } from 'lucide-react'

const filters: { value: TodoFilter; label: string; icon: any }[] = [
  { value: 'all', label: 'All', icon: List },
  { value: 'active', label: 'Active', icon: Circle },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
  { value: 'overdue', label: 'Overdue', icon: AlertCircle },
  { value: 'today', label: 'Today', icon: Calendar },
  { value: 'week', label: 'This Week', icon: CalendarDays },
]

export function TodoFilters() {
  const [currentFilter, setFilter] = useAtom(filterAtom)

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon
        return (
          <Button
            key={filter.value}
            variant={currentFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filter.value)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
          </Button>
        )
      })}
    </div>
  )
}
