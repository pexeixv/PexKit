import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { format, differenceInDays, differenceInYears } from 'date-fns'
import { MoreVertical, Pencil, Trash2, Calendar, Cake } from 'lucide-react'
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
import type { Birthday } from '../types'
import { useBirthdays } from '../hooks/useBirthdays'
import { useGroups } from '../hooks/useGroups'
import { editingBirthdayIdAtom } from '../atoms'

interface BirthdayCardProps {
  birthday: Birthday
  isToday?: boolean
}

export function BirthdayCard({ birthday, isToday }: BirthdayCardProps) {
  const { deleteBirthday } = useBirthdays()
  const { groups } = useGroups()
  const setEditingBirthdayId = useSetAtom(editingBirthdayIdAtom)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Calculate next birthday and days until
  const now = new Date()
  const currentYear = now.getFullYear()
  let nextBirthday = new Date(currentYear, birthday.birthMonth - 1, birthday.birthDay)

  if (nextBirthday < now && !isToday) {
    nextBirthday = new Date(currentYear + 1, birthday.birthMonth - 1, birthday.birthDay)
  }

  const daysUntil = differenceInDays(nextBirthday, now)

  const age = birthday.birthYear
    ? differenceInYears(
        nextBirthday,
        new Date(birthday.birthYear, birthday.birthMonth - 1, birthday.birthDay)
      )
    : null

  const handleEdit = () => {
    setEditingBirthdayId(birthday.id)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteBirthday(birthday.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete birthday:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getDaysUntilText = () => {
    if (isToday) return 'Today! 🎉'
    if (daysUntil === 1) return 'Tomorrow'
    if (daysUntil < 7) return `In ${daysUntil} days`
    if (daysUntil < 30) return `In ${Math.floor(daysUntil / 7)} weeks`
    if (daysUntil < 365) return `In ${Math.floor(daysUntil / 30)} months`
    return format(nextBirthday, 'MMM d, yyyy')
  }

  const birthdayGroups = groups.filter((g) => birthday.groups?.includes(g.id))

  return (
    <>
      <div
        className={cn(
          'group bg-card border rounded-lg p-4 transition-all hover:shadow-md',
          isToday && 'border-green-500 bg-green-500/5'
        )}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold',
              isToday ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'
            )}
          >
            {birthday.name.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{birthday.name}</h3>
              {isToday && <span className="text-xl">🎂</span>}
            </div>

            {/* Groups */}
            {birthdayGroups.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {birthdayGroups.map((group) => (
                  <Badge
                    key={group.id}
                    variant="outline"
                    className="text-xs gap-1"
                    style={{
                      backgroundColor: `${group.color}20`,
                      borderColor: group.color,
                      color: group.color,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Date Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(nextBirthday, 'MMMM d')}</span>
              </div>

              {age && (
                <div className="flex items-center gap-1">
                  <Cake className="h-3 w-3" />
                  <span>Turning {age}</span>
                </div>
              )}

              <div className={cn('font-medium', isToday && 'text-green-500')}>
                {getDaysUntilText()}
              </div>
            </div>

            {/* Notes */}
            {birthday.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{birthday.notes}</p>
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
            <AlertDialogTitle>Delete Birthday</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {birthday.name}'s birthday? This action cannot be
              undone.
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
