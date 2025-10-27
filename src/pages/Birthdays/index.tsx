import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBirthdays } from './hooks/useBirthdays'
import { BirthdayStats } from './components/BirthdayStats'
import { BirthdayForm } from './components/BirthdayForm'
import { BirthdayList } from './components/BirthdayList'
import { BirthdayCalendar } from './components/BirthdayCalendar'
import { ManageGroups } from './components/ManageGroups'
import { viewModeAtom, searchAtom, isAddDialogOpenAtom, editingBirthdayIdAtom } from './atoms'

export default function BirthdaysPage() {
  const { birthdays, loading, error } = useBirthdays()
  const [viewMode, setViewMode] = useAtom(viewModeAtom)
  const [search, setSearch] = useAtom(searchAtom)
  const [, setIsAddDialogOpen] = useAtom(isAddDialogOpenAtom)
  const [editingBirthdayId] = useAtom(editingBirthdayIdAtom)

  const filteredBirthdays = useMemo(() => {
    if (!search) return birthdays

    const searchLower = search.toLowerCase()
    return birthdays.filter(
      (b) =>
        b.name.toLowerCase().includes(searchLower) || b.notes?.toLowerCase().includes(searchLower)
    )
  }, [birthdays, search])

  const editingBirthday = useMemo(() => {
    return editingBirthdayId ? birthdays.find((b) => b.id === editingBirthdayId) : null
  }, [editingBirthdayId, birthdays])

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
          <p className="text-destructive mb-4">Error loading birthdays: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Birthday Tracker 🎂</h1>
          <p className="text-muted-foreground">Never forget an important birthday again</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Birthday
        </Button>
      </div>

      {/* Stats */}
      <BirthdayStats birthdays={birthdays} />

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search birthdays..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* View Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <BirthdayList birthdays={filteredBirthdays} />
        </TabsContent>

        <TabsContent value="calendar">
          <BirthdayCalendar birthdays={filteredBirthdays} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <BirthdayForm editingBirthday={editingBirthday} />
      <ManageGroups />
    </div>
  )
}
