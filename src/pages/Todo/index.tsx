import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTodos } from './hooks/useTodos'
import { TodoStats } from './components/TodoStats'
import { TodoFilters } from './components/TodoFilters'
import { TodoSearch } from './components/TodoSearch'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { filterAtom, searchAtom, sortAtom, isAddDialogOpenAtom, editingTodoIdAtom } from './atoms'
import { startOfDay, endOfDay, addDays, isBefore } from 'date-fns'

export default function TodoPage() {
  const { todos, loading, error } = useTodos()
  const [filter] = useAtom(filterAtom)
  const [search] = useAtom(searchAtom)
  const [sort] = useAtom(sortAtom)
  const [, setIsAddDialogOpen] = useAtom(isAddDialogOpenAtom)
  const [editingTodoId] = useAtom(editingTodoIdAtom)

  // Filter todos
  const filteredTodos = useMemo(() => {
    let result = [...todos]
    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const weekEnd = endOfDay(addDays(now, 7))

    // Apply filter
    switch (filter) {
      case 'active':
        result = result.filter((t) => !t.completed)
        break
      case 'completed':
        result = result.filter((t) => t.completed)
        break
      case 'overdue':
        result = result.filter(
          (t) => !t.completed && t.dueDate && isBefore(new Date(t.dueDate), todayStart)
        )
        break
      case 'today':
        result = result.filter((t) => {
          if (!t.dueDate) return false
          const due = new Date(t.dueDate)
          return due >= todayStart && due <= todayEnd
        })
        break
      case 'week':
        result = result.filter((t) => {
          if (!t.dueDate) return false
          const due = new Date(t.dueDate)
          return due >= todayStart && due <= weekEnd
        })
        break
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply sort
    switch (sort) {
      case 'priority': {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        break
      }
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'createdAt':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [todos, filter, search, sort])

  const editingTodo = useMemo(() => {
    return editingTodoId ? todos.find((t) => t.id === editingTodoId) : null
  }, [editingTodoId, todos])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading todos: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Todo List</h1>
          <p className="text-muted-foreground">Manage your tasks with priorities and due dates</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2 cursor-pointer">
          <Plus className="size-5" />
          Add Todo
        </Button>
      </div>

      {/* Stats */}
      <TodoStats todos={todos} />

      {/* Filters */}
      <TodoFilters />

      {/* Search */}
      <TodoSearch />

      {/* Todo List */}
      <TodoList todos={filteredTodos} />

      {/* Add/Edit Dialog */}
      <TodoForm editingTodo={editingTodo} />
    </div>
  )
}
