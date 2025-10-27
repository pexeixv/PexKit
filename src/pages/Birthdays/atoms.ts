import { atom } from 'jotai'
import type { ViewMode } from './types'

export const viewModeAtom = atom<ViewMode>('list')
export const searchAtom = atom<string>('')
export const selectedGroupsAtom = atom<string[]>([])
export const isAddDialogOpenAtom = atom<boolean>(false)
export const editingBirthdayIdAtom = atom<string | null>(null)
export const isManageGroupsDialogOpenAtom = atom<boolean>(false)
