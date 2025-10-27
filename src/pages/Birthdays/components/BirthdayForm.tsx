import { useState, useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
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
import { Badge } from '@/components/ui/badge'
import { X, Settings } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { isAddDialogOpenAtom, editingBirthdayIdAtom, isManageGroupsDialogOpenAtom } from '../atoms'
import type { Birthday } from '../types'
import { useBirthdays } from '../hooks/useBirthdays'
import { useGroups } from '../hooks/useGroups'

interface BirthdayFormProps {
  editingBirthday?: Birthday | null
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function BirthdayForm({ editingBirthday }: BirthdayFormProps) {
  const [isOpen, setIsOpen] = useAtom(isAddDialogOpenAtom)
  const [, setEditingId] = useAtom(editingBirthdayIdAtom)
  const setIsManageGroupsOpen = useSetAtom(isManageGroupsDialogOpenAtom)
  const { addBirthday, updateBirthday } = useBirthdays()
  const { groups } = useGroups()

  const [name, setName] = useState('')
  const [birthMonth, setBirthMonth] = useState<number>(1)
  const [birthDay, setBirthDay] = useState<number>(1)
  const [birthYear, setBirthYear] = useState<string>('')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingBirthday) {
      setName(editingBirthday.name)
      setBirthMonth(editingBirthday.birthMonth)
      setBirthDay(editingBirthday.birthDay)
      setBirthYear(editingBirthday.birthYear?.toString() || '')
      setSelectedGroups(editingBirthday.groups || [])
      setNotes(editingBirthday.notes || '')
      setIsOpen(true)
    }
  }, [editingBirthday, setIsOpen])

  const resetForm = () => {
    setName('')
    setBirthMonth(1)
    setBirthDay(1)
    setBirthYear('')
    setSelectedGroups([])
    setNotes('')
    setEditingId(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(resetForm, 200)
  }

  const getDaysInMonth = (month: number) => {
    const year = new Date().getFullYear()
    return new Date(year, month, 0).getDate()
  }

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const birthdayData: any = {
        name: name.trim(),
        birthMonth,
        birthDay,
        groups: selectedGroups,
      }

      if (birthYear.trim()) {
        const year = parseInt(birthYear.trim())
        if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear()) {
          birthdayData.birthYear = year
        }
      }

      if (notes.trim()) {
        birthdayData.notes = notes.trim()
      }

      if (editingBirthday) {
        await updateBirthday(editingBirthday.id, birthdayData)
      } else {
        await addBirthday(birthdayData)
      }

      handleClose()
    } catch (error) {
      console.error('Error saving birthday:', error)
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = getDaysInMonth(birthMonth)
  const validBirthDay = birthDay <= daysInMonth ? birthDay : 1

  const getGroupById = (groupId: string) => groups.find((g) => g.id === groupId)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingBirthday ? 'Edit Birthday' : 'Add Birthday'}</DialogTitle>
          <DialogDescription>
            {editingBirthday ? 'Update birthday details' : 'Add a new birthday to track'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
              autoFocus
            />
          </div>

          {/* Birthday Date */}
          <div className="space-y-2">
            <Label>Birthday Date *</Label>
            <div className="grid grid-cols-2 gap-4">
              {/* Month */}
              <div>
                <Label htmlFor="month" className="text-xs text-muted-foreground">
                  Month
                </Label>
                <Select
                  value={birthMonth.toString()}
                  onValueChange={(v) => {
                    const newMonth = parseInt(v)
                    setBirthMonth(newMonth)
                    const maxDays = getDaysInMonth(newMonth)
                    if (birthDay > maxDays) {
                      setBirthDay(maxDays)
                    }
                  }}
                >
                  <SelectTrigger id="month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day */}
              <div>
                <Label htmlFor="day" className="text-xs text-muted-foreground">
                  Day
                </Label>
                <Select
                  value={validBirthDay.toString()}
                  onValueChange={(v) => setBirthDay(parseInt(v))}
                >
                  <SelectTrigger id="day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Birth Year (Optional) */}
          <div>
            <Label htmlFor="year">Birth Year (Optional)</Label>
            <Input
              id="year"
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="e.g., 1990"
              min="1900"
              max={new Date().getFullYear()}
            />
            <p className="text-xs text-muted-foreground mt-1">Used to calculate age</p>
          </div>

          {/* Groups */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Groups</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsManageGroupsOpen(true)
                }}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </div>

            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No groups yet. Click "Manage" to create one.
              </p>
            ) : (
              <div className="border rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => toggleGroup(group.id)}
                    />
                    <label
                      htmlFor={`group-${group.id}`}
                      className="flex items-center gap-2 flex-1 cursor-pointer"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-sm">{group.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Groups Display */}
            {selectedGroups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedGroups.map((groupId) => {
                  const group = getGroupById(groupId)
                  if (!group) return null
                  return (
                    <Badge
                      key={groupId}
                      variant="secondary"
                      className="gap-1"
                      style={{
                        backgroundColor: `${group.color}20`,
                        borderColor: group.color,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      {group.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleGroup(groupId)} />
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gift ideas, preferences, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Saving...' : editingBirthday ? 'Update' : 'Add Birthday'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
