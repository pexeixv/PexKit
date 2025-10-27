import { useMemo } from 'react'
import { PartyPopper, CalendarDays, Calendar as CalendarIcon } from 'lucide-react'
import { BirthdayCard } from './BirthdayCard'
import type { Birthday } from '../types'
import { isSameDay, isThisWeek, isThisMonth } from 'date-fns'

interface BirthdayListProps {
  birthdays: Birthday[]
}

export function BirthdayList({ birthdays }: BirthdayListProps) {
  const groupedBirthdays = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()

    const groups = {
      today: [] as Birthday[],
      thisWeek: [] as Birthday[],
      thisMonth: [] as Birthday[],
      upcoming: [] as Birthday[],
    }

    birthdays.forEach((birthday) => {
      const nextBirthday = new Date(currentYear, birthday.birthMonth - 1, birthday.birthDay)

      // If birthday passed this year, use next year
      const birthdayToCheck =
        nextBirthday < now
          ? new Date(currentYear + 1, birthday.birthMonth - 1, birthday.birthDay)
          : nextBirthday

      if (isSameDay(birthdayToCheck, now)) {
        groups.today.push(birthday)
      } else if (isThisWeek(birthdayToCheck, { weekStartsOn: 0 })) {
        groups.thisWeek.push(birthday)
      } else if (isThisMonth(birthdayToCheck)) {
        groups.thisMonth.push(birthday)
      } else {
        groups.upcoming.push(birthday)
      }
    })

    // Sort each group by date
    const sortByDate = (a: Birthday, b: Birthday) => {
      const now = new Date()
      const year = now.getFullYear()

      let dateA = new Date(year, a.birthMonth - 1, a.birthDay)
      let dateB = new Date(year, b.birthMonth - 1, b.birthDay)

      if (dateA < now) dateA = new Date(year + 1, a.birthMonth - 1, a.birthDay)
      if (dateB < now) dateB = new Date(year + 1, b.birthMonth - 1, b.birthDay)

      return dateA.getTime() - dateB.getTime()
    }

    groups.thisWeek.sort(sortByDate)
    groups.thisMonth.sort(sortByDate)
    groups.upcoming.sort(sortByDate)

    return groups
  }, [birthdays])

  if (birthdays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PartyPopper className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No birthdays yet</h3>
        <p className="text-muted-foreground max-w-md">
          Start adding birthdays to keep track of important dates!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Today */}
      {groupedBirthdays.today.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PartyPopper className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold">Today ({groupedBirthdays.today.length})</h2>
          </div>
          <div className="space-y-3">
            {groupedBirthdays.today.map((birthday) => (
              <BirthdayCard key={birthday.id} birthday={birthday} isToday />
            ))}
          </div>
        </div>
      )}

      {/* This Week */}
      {groupedBirthdays.thisWeek.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold">This Week ({groupedBirthdays.thisWeek.length})</h2>
          </div>
          <div className="space-y-3">
            {groupedBirthdays.thisWeek.map((birthday) => (
              <BirthdayCard key={birthday.id} birthday={birthday} />
            ))}
          </div>
        </div>
      )}

      {/* This Month */}
      {groupedBirthdays.thisMonth.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-bold">This Month ({groupedBirthdays.thisMonth.length})</h2>
          </div>
          <div className="space-y-3">
            {groupedBirthdays.thisMonth.map((birthday) => (
              <BirthdayCard key={birthday.id} birthday={birthday} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {groupedBirthdays.upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">Upcoming ({groupedBirthdays.upcoming.length})</h2>
          </div>
          <div className="space-y-3">
            {groupedBirthdays.upcoming.map((birthday) => (
              <BirthdayCard key={birthday.id} birthday={birthday} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
