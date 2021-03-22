import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { useRate } from '../hooks/use-rate'

import { inverseColorAtom, profitModeAtom } from '../libs/atoms'
import { formatNumber } from '../libs/formatter'
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
      return num >= 0 ? `+${formatNumber(num)}` : formatNumber(num)
    }
    if (profitMode === 'HIDE') {
      return num >= 0 ? '+***' : '-***'
    }
    if (profitMode === 'PERCENTAGE') {
      const percentage =
        props.cost === 0
          ? 100
          : formatNumber(((props.price - props.cost) / props.cost) * 100)
      return props.price - props.cost >= 0
        ? `+${percentage}%`
        : `${percentage}%`
    }
    return null
  }, [profitMode, props.amount, props.cost, props.price, rate])

  return (
    <span className={props.className} style={{ color }}>
      {profit}
    </span>
  )
}
