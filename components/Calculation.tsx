import { cx, css } from '@linaria/core'
import { useAtom } from 'jotai'

import { hidePriceAtom } from '../libs/atoms'
import { formatNumber } from '../libs/formatter'

/**
 * (x - y) * z =
 * x - y =
 * x * z =
 */
export default function Calculation(props: {
  className?: string
  x: number
  y: number
  z?: number
}) {
  const [hidePrice] = useAtom(hidePriceAtom)

  return (
    <span
      className={cx(
        css`
          color: #d3d3d3;
        `,
        props.className,
      )}>
      {hidePrice
        ? null
        : 'z' in props && props.z !== undefined
        ? props.y === 0
          ? `${formatNumber(props.x)} x ${formatNumber(props.z)} =`
          : `(${formatNumber(props.x)} - ${formatNumber(
              props.y,
            )}) x ${formatNumber(props.z)} =`
        : `${formatNumber(props.x)} - ${formatNumber(props.y)} =`}
    </span>
  )
}
