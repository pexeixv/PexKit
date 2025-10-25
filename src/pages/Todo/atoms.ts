import { atom } from 'jotai'
import type { TodoFilter, SortOption } from './types'

export const filterAtom = atom<TodoFilter>('all')
export const sortAtom = atom<SortOption>('createdAt')
export const searchAtom = atom<string>('')
export const selectedTagsAtom = atom<string[]>([])
export const isAddDialogOpenAtom = atom<boolean>(false)
export const editingTodoIdAtom = atom<string | null>(null)
