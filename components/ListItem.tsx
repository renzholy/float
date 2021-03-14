import { css, cx } from '@linaria/core'
import { useEffect } from 'react'

import { usePrice } from '../hooks/use-price'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { Item } from '../libs/types'

export function ListItem(props: { value: Item }) {
  const item = props.value
  const { data: price } = usePrice('CNY', item.type, item.id)
  useEffect(() => {
    db.items.update([item.type, item.id], { price })
  }, [item.id, item.type, price])

  return (
    <tr>
      <td>
        {item.name}
        {item.price === undefined ? null : (
          <span
            className={cx(
              css`
                float: right;
              `,
              'nes-text is-disabled',
            )}>
            {formatNumber(item.amount)} x {formatNumber(item.price)}
          </span>
        )}
        <br />
        <span className="nes-text is-disabled">
          {item.type}
          &nbsp;
          {item.code}
        </span>
        <span
          className={css`
            float: right;
          `}>
          {item.price === undefined
            ? '-'
            : formatNumber(item.amount * item.price)}
        </span>
      </td>
    </tr>
  )
}
