import { useMemo } from 'react'
import { Cake, Calendar, CalendarDays, Users } from 'lucide-react'
import type { Birthday } from '../types'
import { isThisWeek, isThisMonth, isSameDay } from 'date-fns'

interface BirthdayStatsProps {
  birthdays: Birthday[]
}

export function BirthdayStats({ birthdays }: BirthdayStatsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()

    const today = birthdays.filter((b) => {
      const bday = new Date(currentYear, b.birthMonth - 1, b.birthDay)
      return isSameDay(bday, now)
    })

    const thisWeek = birthdays.filter((b) => {
      const bday = new Date(currentYear, b.birthMonth - 1, b.birthDay)
      return isThisWeek(bday, { weekStartsOn: 0 })
    })

    const thisMonth = birthdays.filter((b) => {
      const bday = new Date(currentYear, b.birthMonth - 1, b.birthDay)
      return isThisMonth(bday)
    })

    return {
      total: birthdays.length,
      today: today.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
    }
  }, [birthdays])

  const statCards = [
    { label: 'Total', value: stats.total, icon: Users, color: 'text-blue-500' },
    { label: 'Today', value: stats.today, icon: Cake, color: 'text-green-500' },
    { label: 'This Week', value: stats.thisWeek, icon: Calendar, color: 'text-yellow-500' },
    { label: 'This Month', value: stats.thisMonth, icon: CalendarDays, color: 'text-purple-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
