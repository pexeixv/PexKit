import { useAtom } from 'jotai'
import { ArrowUpDown, ListX } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TodoItem } from './TodoItem'
import { sortAtom } from '../atoms'
import type { Todo, SortOption } from '../types'

interface TodoListProps {
  todos: Todo[]
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'Alphabetical' },
]

export function TodoList({ todos }: TodoListProps) {
  const [sort, setSort] = useAtom(sortAtom)

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ListX className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No todos found</h3>
        <p className="text-muted-foreground max-w-md">
          Get started by adding your first todo or try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}
