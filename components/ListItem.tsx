import { css } from '@linaria/core'

import { usePrice } from '../hooks/use-price'
import { formatNumber } from '../libs/formatter'
import { Item } from '../libs/types'

export function ListItem(props: { className?: string; value: Item }) {
  const item = props.value
  const { data: price } = usePrice('CNY', item.type, item.id)

  return (
    <div className={props.className}>
      {item.name}
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
        {price === undefined ? '-' : formatNumber((item.amount || 1) * price)}
      </span>
    </div>
  )
}
