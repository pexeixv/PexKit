export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Todo {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type TodoInput = Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completedAt'>

export type TodoFilter = 'all' | 'active' | 'completed' | 'overdue' | 'today' | 'week'

export type SortOption = 'priority' | 'dueDate' | 'createdAt' | 'alphabetical'
