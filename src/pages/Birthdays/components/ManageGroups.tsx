import { useState } from 'react'
import { useAtom } from 'jotai'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { isManageGroupsDialogOpenAtom } from '../atoms'
import { useGroups } from '../hooks/useGroups'
import type { Group } from '../types'

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#8b5cf6', // purple
  '#f59e0b', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export function ManageGroups() {
  const [isOpen, setIsOpen] = useAtom(isManageGroupsDialogOpenAtom)
  const { groups, addGroup, updateGroup, deleteGroup } = useGroups()

  const [isAdding, setIsAdding] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)

  const [groupName, setGroupName] = useState('')
  const [groupColor, setGroupColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setGroupName('')
    setGroupColor(PRESET_COLORS[0])
    setIsAdding(false)
    setEditingGroup(null)
  }

  const handleAdd = async () => {
    if (!groupName.trim()) return

    setLoading(true)
    try {
      await addGroup({
        name: groupName.trim(),
        color: groupColor,
      })
      resetForm()
    } catch (error) {
      console.error('Error adding group:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingGroup || !groupName.trim()) return

    setLoading(true)
    try {
      await updateGroup(editingGroup.id, {
        name: groupName.trim(),
        color: groupColor,
      })
      resetForm()
    } catch (error) {
      console.error('Error updating group:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingGroup) return

    setLoading(true)
    try {
      await deleteGroup(deletingGroup.id)
      setDeletingGroup(null)
    } catch (error) {
      console.error('Error deleting group:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (group: Group) => {
    setEditingGroup(group)
    setGroupName(group.name)
    setGroupColor(group.color)
    setIsAdding(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Groups</DialogTitle>
            <DialogDescription>
              Create and organize groups to categorize birthdays
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add/Edit Form */}
            {isAdding ? (
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{editingGroup ? 'Edit Group' : 'New Group'}</h4>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., School Friends"
                    autoFocus
                  />
                </div>

                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2 mt-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setGroupColor(color)}
                        className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: groupColor === color ? '#000' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={editingGroup ? handleEdit : handleAdd}
                  disabled={loading || !groupName.trim()}
                  className="w-full"
                >
                  {loading ? 'Saving...' : editingGroup ? 'Update' : 'Add Group'}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add New Group
              </Button>
            )}

            {/* Groups List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="font-medium">{group.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(group)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeletingGroup(group)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingGroup} onOpenChange={() => setDeletingGroup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingGroup?.name}"? Birthdays in this group won't
              be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
