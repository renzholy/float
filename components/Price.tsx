import { css, cx } from '@linaria/core'
import { useAtom } from 'jotai'

import { hidePriceAtom, inverseColorAtom } from '../libs/atoms'
import { formatNumber } from '../libs/formatter'

export default function Price(props: { className?: string; value?: number }) {
  const [inverseColor] = useAtom(inverseColorAtom)
  const [hidePrice] = useAtom(hidePriceAtom)

  return (
    <span
      className={cx(
        props.value === undefined ||
          formatNumber(props.value) === '0.00' ||
          formatNumber(props.value) === '-0.00'
          ? css`
              color: #adafbc;
            `
          : props.value > 0
          ? inverseColor
            ? css`
                color: #92cc41;
              `
            : css`
                color: #e76e55;
              `
          : inverseColor
          ? css`
              color: #e76e55;
            `
          : css`
              color: #92cc41;
            `,
        props.className,
      )}>
      {props.value !== undefined && props.value > 0 ? '+' : null}
      {props.value === undefined
        ? '-'
        : hidePrice
        ? props.value < 0
          ? '-***'
          : '***'
        : formatNumber(props.value)}
    </span>
  )
}
