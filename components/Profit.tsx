import { useAtom } from 'jotai'
import { useMemo } from 'react'

import { profitModeAtom, inverseColorAtom } from '../libs/atoms'
import { formatNumber } from '../libs/formatter'

export default function Profit(props: {
  className?: string
  price?: number
  cost: number
  amount: number
}) {
  const [inverseColor] = useAtom(inverseColorAtom)
  const [profitMode] = useAtom(profitModeAtom)
  const color = useMemo(() => {
    if (props.price === undefined) {
      return undefined
    }
    if (props.price - props.cost >= 0) {
      return inverseColor ? '#92cc41' : '#e76e55'
    }
    return inverseColor ? '#e76e55' : '#92cc41'
  }, [inverseColor, props.cost, props.price])
  const profit = useMemo(() => {
    if (props.price === undefined) {
      return null
    }
    const num = (props.price - props.cost) * props.amount
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
      return percentage >= 0 ? `+${percentage}%` : `${percentage}%`
    }
    return null
  }, [profitMode, props.amount, props.cost, props.price])

  return (
    <span className={props.className} style={{ color }}>
      {profit}
    </span>
  )
}
