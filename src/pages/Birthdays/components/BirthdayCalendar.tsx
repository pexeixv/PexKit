import { useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Birthday } from '../types'
import { format, isSameDay } from 'date-fns'

interface BirthdayCalendarProps {
  birthdays: Birthday[]
}

export function BirthdayCalendar({ birthdays }: BirthdayCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get birthdays for selected date
  const birthdaysOnSelectedDate = useMemo(() => {
    if (!selectedDate) return []

    return birthdays.filter((birthday) => {
      const birthdayDate = new Date(
        selectedDate.getFullYear(),
        birthday.birthMonth - 1,
        birthday.birthDay
      )
      return isSameDay(birthdayDate, selectedDate)
    })
  }, [birthdays, selectedDate])

  // Create modifiers for calendar
  const birthdayDates = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return birthdays.map(
      (birthday) => new Date(currentYear, birthday.birthMonth - 1, birthday.birthDay)
    )
  }, [birthdays])

  const modifiers = {
    birthdays: birthdayDates,
  }

  const modifiersClassNames = {
    birthdays:
      'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2 p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-md"
        />
      </Card>

      {/* Birthdays on selected date */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
        </h3>

        {birthdaysOnSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {birthdaysOnSelectedDate.map((birthday) => {
              const age = birthday.birthYear
                ? selectedDate!.getFullYear() - birthday.birthYear
                : null

              return (
                <div key={birthday.id} className="bg-muted rounded-lg p-3 border">
                  <button onClick={() => console.log(JSON.stringify(birthday.groups))}>t</button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
                      {birthday.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{birthday.name}</p>
                      {age && <p className="text-sm text-muted-foreground">Turning {age}</p>}
                    </div>
                  </div>
                  {birthday?.groups?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {birthday?.groups?.map((group) => (
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
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No birthdays on this date</p>
          </div>
        )}
      </Card>
    </div>
  )
}
