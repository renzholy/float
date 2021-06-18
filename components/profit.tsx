import { useAtom } from 'jotai'
import { useMemo } from 'react'
import numeral from 'numeral'

import { useRate } from '../hooks/use-rate'
import { inverseColorAtom, profitModeAtom } from '../libs/atoms'
import { Currency } from '../libs/types'

export default function Profit(props: {
  className?: string
  price?: number
  cost: number
  amount: number
  currency: Currency
}) {
  const rate = useRate(props.currency)
  const [inverseColor] = useAtom(inverseColorAtom)
  const [profitMode] = useAtom(profitModeAtom)
  const color = useMemo(() => {
    if (props.price === undefined) {
      return 'var(--color-gray-1)'
    }
    if (props.price - props.cost >= 0) {
      return inverseColor ? 'var(--color-success-0)' : 'var(--color-error-0)'
    }
    return inverseColor ? 'var(--color-error-0)' : 'var(--color-success-0)'
  }, [inverseColor, props.cost, props.price])
  const profit = useMemo(() => {
    if (props.price === undefined) {
      return '-'
    }
    const num = (props.price - props.cost) * rate * props.amount
    if (profitMode === 'SHOW') {
      return numeral(num).format('+0,0.00')
    }
    if (profitMode === 'HIDE') {
      return num >= 0 ? '+' : '-'
    }
    if (profitMode === 'PERCENTAGE') {
      return numeral(
        props.cost === 0
          ? props.amount === 0
            ? 0
            : 1
          : (props.price - props.cost) / props.cost,
      ).format('+0,0.0%')
    }
    return null
  }, [profitMode, props.amount, props.cost, props.price, rate])

  return (
    <span className={props.className} style={{ color }}>
      {profit}
    </span>
  )
}
