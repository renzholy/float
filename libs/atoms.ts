import { atom } from 'jotai'

import { Currency, ProfitMode } from './types'

export const inverseColorAtom = atom(false)

export const profitModeAtom = atom<ProfitMode>('SHOW')

export const largeFontAtom = atom(false)

export const currencyAtom = atom<Currency>('CNY')
