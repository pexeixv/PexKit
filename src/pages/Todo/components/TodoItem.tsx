import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { format, isPast, startOfDay } from 'date-fns'
import { MoreVertical, Pencil, Trash2, Calendar, Clock, Flag } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import type { Todo, Priority } from '../types'
import { useTodos } from '../hooks/useTodos'
import { editingTodoIdAtom } from '../atoms'

interface TodoItemProps {
  todo: Todo
}

const priorityConfig: Record<Priority, { color: string; label: string; icon: string }> = {
  urgent: { color: 'bg-red-500/10 text-red-500 border-red-500/20', label: 'Urgent', icon: '🔴' },
  high: {
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    label: 'High',
    icon: '🟠',
  },
  medium: {
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    label: 'Medium',
    icon: '🟡',
  },
  low: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', label: 'Low', icon: '🔵' },
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete, deleteTodo } = useTodos()
  const setEditingTodoId = useSetAtom(editingTodoIdAtom)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOverdue = todo.dueDate && !todo.completed && isPast(startOfDay(new Date(todo.dueDate)))
  const priorityInfo = priorityConfig[todo.priority]

  const handleToggle = async () => {
    try {
      await toggleComplete(todo.id, !todo.completed)
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleEdit = () => {
    setEditingTodoId(todo.id)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTodo(todo.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete todo:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'group bg-card border rounded-lg p-4 transition-all hover:shadow-md',
          todo.completed && 'opacity-60',
          isOverdue && 'border-red-500/50'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Checkbox checked={todo.completed} onCheckedChange={handleToggle} className="mt-1" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3
              className={cn(
                'font-semibold text-lg mb-1',
                todo.completed && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </h3>

            {/* Description */}
            {todo.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{todo.description}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Priority */}
              <Badge variant="outline" className={cn('gap-1', priorityInfo.color)}>
                <Flag className="h-3 w-3" />
                {priorityInfo.label}
              </Badge>

              {/* Due Date */}
              {todo.dueDate && (
                <Badge
                  variant="outline"
                  className={cn(
                    'gap-1',
                    isOverdue && 'bg-red-500/10 text-red-500 border-red-500/20'
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                  {isOverdue && ' (Overdue)'}
                </Badge>
              )}

              {/* Completed At */}
              {todo.completed && todo.completedAt && (
                <Badge
                  variant="outline"
                  className="gap-1 bg-green-500/10 text-green-500 border-green-500/20"
                >
                  <Clock className="h-3 w-3" />
                  Completed {format(new Date(todo.completedAt), 'MMM d')}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {todo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{todo.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
