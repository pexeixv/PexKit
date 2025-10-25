import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ChevronDownIcon, X } from 'lucide-react'
import { isAddDialogOpenAtom, editingTodoIdAtom } from '../atoms'
import type { Todo, Priority } from '../types'
import { useTodos } from '../hooks/useTodos'

interface TodoFormProps {
  editingTodo?: Todo | null
}

export function TodoForm({ editingTodo }: TodoFormProps) {
  const [isOpen, setIsOpen] = useAtom(isAddDialogOpenAtom)
  const [, setEditingId] = useAtom(editingTodoIdAtom)
  const { addTodo, updateTodo } = useTodos()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [dueTime, setDueTime] = useState<string>('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title)
      setDescription(editingTodo.description || '')
      setPriority(editingTodo.priority)

      if (editingTodo.dueDate) {
        const date = new Date(editingTodo.dueDate)
        setDueDate(date)
        setDueTime(format(date, 'HH:mm'))
      }

      setTags(editingTodo.tags)
      setIsOpen(true)
    }
  }, [editingTodo, setIsOpen])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate(undefined)
    setDueTime('')
    setTags([])
    setTagInput('')
    setEditingId(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(resetForm, 200)
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const combineDateAndTime = (date: Date, time: string): Date => {
    if (!time) {
      // If no time is provided, set to end of day (23:59)
      const combined = new Date(date)
      combined.setHours(23, 59, 0, 0)
      return combined
    }

    const [hours, minutes] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    return combined
  }

  const handleClearDate = () => {
    setDueDate(undefined)
    setDueTime('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      const todoData: any = {
        title: title.trim(),
        priority,
        tags,
        completed: editingTodo?.completed || false,
      }

      if (description.trim()) {
        todoData.description = description.trim()
      }

      if (dueDate) {
        const combinedDateTime = combineDateAndTime(dueDate, dueTime)
        todoData.dueDate = combinedDateTime.toISOString()
      }

      if (editingTodo) {
        await updateTodo(editingTodo.id, todoData)
      } else {
        await addTodo(todoData)
      }

      handleClose()
    } catch (error) {
      console.error('Error saving todo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
          <DialogDescription>
            {editingTodo ? 'Update your task details' : 'Create a new task to track'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger id="priority" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date & Time */}
          <div className="space-y-2">
            <Label>Due</Label>
            <div className="flex gap-4">
              {/* Date Picker */}
              <div className="flex flex-col gap-3 flex-1">
                <Label htmlFor="date-picker" className="px-1 text-xs text-muted-foreground">
                  Date
                </Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="justify-between font-normal"
                    >
                      {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Select date'}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDueDate(date)
                        setDatePickerOpen(false)
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1 text-xs text-muted-foreground">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time-picker"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={!dueDate}
                  className="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>

            {dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Due: {format(dueDate, 'MMM d, yyyy')}
                  {dueTime && ` at ${format(new Date(`2000-01-01T${dueTime}`), 'h:mm a')}`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDate}
                  className="h-6 px-2"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add tag and press Enter"
                className="mt-2"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
                className="cursor-pointer mt-auto"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()} className="cursor-pointer">
              {loading ? 'Saving...' : editingTodo ? 'Update' : 'Add Todo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
