import { useAtom } from 'jotai'

import { currencyAtom } from '../libs/atoms'
import { Currency } from '../libs/types'
import { useRates } from './use-rates'

export function useRate(currency: Currency) {
  const [globalCurrency] = useAtom(currencyAtom)
  const rates = useRates()
  return rates[globalCurrency] / rates[currency]
}
