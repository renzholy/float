import { css, cx } from '@emotion/css'
import { useAtom } from 'jotai'
import numeral from 'numeral'
import { useCallback, useMemo } from 'react'

import { useRate } from '../hooks/use-rate'
import { profitModeAtom } from '../libs/atoms'
import { Currency } from '../libs/types'

/**
 * (price - cost) × amount =
 * price - cost =
 * price × amount =
 *
 * (price - cost) × rate × amount =
 * (price - cost) × rate =
 * price × rate × amount =
 */
export default function Calculation(props: {
  className?: string
  price?: number
  cost: number
  amount?: number
  currency: Currency
}) {
  const rate = useRate(props.currency)
  const [profitMode] = useAtom(profitModeAtom)
  const formatNumber = useCallback(
    (num: number) =>
      Number.isInteger(num)
        ? num.toString()
        : num >= 1000
        ? numeral(num).format('0,0[.][00]')
        : num.toPrecision(5),
    [],
  )
  const text = useMemo(() => {
    if (props.price === undefined) {
      return null
    }
    if (Number.isNaN(props.price) || Number.isNaN(props.cost)) {
      return null
    }
    if (profitMode === 'SHOW') {
      if (rate === 1) {
        return 'amount' in props && props.amount !== undefined
          ? props.cost === 0
            ? `${formatNumber(props.price)} × ${formatNumber(props.amount)} =`
            : `(${formatNumber(props.price)} - ${formatNumber(
                props.cost,
              )}) × ${formatNumber(props.amount)} =`
          : `${formatNumber(props.price)} - ${formatNumber(props.cost)} =`
      }
      return 'amount' in props && props.amount !== undefined
        ? props.cost === 0
          ? `${formatNumber(props.price)} × ${formatNumber(
              rate,
            )} × ${formatNumber(props.amount)} =`
          : `(${formatNumber(props.price)} - ${formatNumber(
              props.cost,
            )}) × ${formatNumber(rate)} × ${formatNumber(props.amount)} =`
        : `(${formatNumber(props.price)} - ${formatNumber(
            props.cost,
          )}) × ${formatNumber(rate)} =`
    }
    if (rate === 1) {
      return formatNumber(props.price)
    }
    return `${formatNumber(props.price)} × ${formatNumber(
      rate,
    )} = ${formatNumber(props.price * rate)}`
  }, [formatNumber, profitMode, props, rate])

  return (
    <span
      className={cx(
        css`
          color: var(--color-gray-2);
        `,
        props.className,
      )}>
      {text}
    </span>
  )
}
