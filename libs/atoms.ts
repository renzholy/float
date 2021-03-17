import { atom } from 'jotai'

export const inverseColorAtom = atom(false)

export type ProfitMode = 'SHOW' | 'HIDE' | 'PERCENTAGE'

export const profitModeAtom = atom<ProfitMode>('SHOW')

export const largeFontAtom = atom(false)
