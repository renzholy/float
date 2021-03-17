import { cx, css } from '@linaria/core'
import { useAtom } from 'jotai'
import { useMemo } from 'react'

import { priceModeAtom } from '../libs/atoms'
import { formatNumber } from '../libs/formatter'

/**
 * (price - cost) x amount =
 * price - cost =
 * price x amount =
 */
export default function Calculation(props: {
  className?: string
  price?: number
  cost: number
  amount?: number
}) {
  const [priceMode] = useAtom(priceModeAtom)
  const text = useMemo(() => {
    if (props.price === undefined) {
      return null
    }
    if (priceMode === 'SHOW') {
      return 'amount' in props && props.amount !== undefined
        ? props.cost === 0
          ? `${formatNumber(props.price)} x ${formatNumber(props.amount)} =`
          : `(${formatNumber(props.price)} - ${formatNumber(
              props.cost,
            )}) x ${formatNumber(props.amount)} =`
        : `${formatNumber(props.price)} - ${formatNumber(props.cost)} =`
    }
    if (priceMode === 'HIDE') {
      return null
    }
    if (priceMode === 'PERCENTAGE') {
      return props.cost === 0
        ? '100%'
        : `${formatNumber(((props.price - props.cost) / props.cost) * 100)}%`
    }
    return null
  }, [priceMode, props])

  return (
    <span
      className={cx(
        css`
          color: #d3d3d3;
        `,
        props.className,
      )}>
      {text}
    </span>
  )
}
