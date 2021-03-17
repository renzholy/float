import { atom } from 'jotai'

export const inverseColorAtom = atom(false)

export type PriceMode = 'SHOW' | 'HIDE' | 'PERCENTAGE'

export const priceModeAtom = atom<PriceMode>('SHOW')

export const largeFontAtom = atom(false)
