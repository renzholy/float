import { css, cx } from '@linaria/core'

import { formatNumber } from '../libs/formatter'

export default function Price(props: { className?: string; value?: number }) {
  return (
    <span
      className={cx(
        props.value === undefined ||
          formatNumber(props.value) === '0.00' ||
          formatNumber(props.value) === '-0.00'
          ? css`
              color: #212529;
            `
          : props.value > 0
          ? css`
              color: #e76e55;
            `
          : css`
              color: #92cc41;
            `,
        props.className,
      )}>
      {props.value !== undefined && props.value > 0 ? '+' : null}
      {props.value === undefined ? '-' : formatNumber(props.value)}
    </span>
  )
}
