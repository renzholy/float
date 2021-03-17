import { cx, css } from '@linaria/core'
import { useAtom } from 'jotai'
import { useMemo } from 'react'

import { profitModeAtom } from '../libs/atoms'
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
  const [profitMode] = useAtom(profitModeAtom)
  const text = useMemo(() => {
    if (props.price === undefined) {
      return null
    }
    if (Number.isNaN(props.price) || Number.isNaN(props.cost)) {
      return null
    }
    if (profitMode === 'SHOW') {
      return 'amount' in props && props.amount !== undefined
        ? props.cost === 0
          ? `${formatNumber(props.price)} x ${formatNumber(props.amount)} =`
          : `(${formatNumber(props.price)} - ${formatNumber(
              props.cost,
            )}) x ${formatNumber(props.amount)} =`
        : `${formatNumber(props.price)} - ${formatNumber(props.cost)} =`
    }
    return null
  }, [profitMode, props])

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
