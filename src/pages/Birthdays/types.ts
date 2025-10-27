export interface Birthday {
  id: string
  userId: string
  name: string
  birthDay: number
  birthYear?: number
  groups: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export type BirthdayInput = Omit<Birthday, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

export type ViewMode = 'list' | 'calendar'

export interface Group {
  id: string
  userId: string
  name: string
  color: string
  createdAt: string
}

export type GroupInput = Omit<Group, 'id' | 'userId' | 'createdAt'>
