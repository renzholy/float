/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import { useEffect, useState } from 'react'

import { usePrice } from '../hooks/use-price'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { Item } from '../libs/types'

export function ListItem(props: {
  value: Item
  isExpanded: boolean
  onClick(): void
}) {
  const item = props.value
  const { data: price } = usePrice('CNY', item.type, item.id)
  useEffect(() => {
    db.items.update([item.type, item.id], { price })
  }, [item.id, item.type, price])
  const [amount, setAmount] = useState('')
  const [cost, setCost] = useState('')
  useEffect(() => {
    setAmount(item.amount.toString())
    if (item.cost !== undefined) {
      setCost(item.cost.toString())
    }
  }, [item.amount, item.cost])

  return (
    <tr onClick={props.onClick}>
      <td>
        <span className="nes-text">{item.name}</span>
        {item.price === undefined ? null : (
          <span
            className={cx(
              css`
                float: right;
              `,
              'nes-text is-disabled',
            )}>
            {formatNumber(item.amount)}&nbsp;x&nbsp;
            {item.cost === undefined
              ? formatNumber(item.price)
              : `(${formatNumber(item.price)} - ${formatNumber(item.cost)})`}
          </span>
        )}
        <br />
        {props.isExpanded ? (
          <div
            className={css`
              margin-top: 8px;
              display: flex;
            `}
            onClick={(e) => {
              e.stopPropagation()
            }}>
            <input
              type="text"
              className={cx(
                'nes-input',
                amount && Number.isNaN(parseFloat(amount))
                  ? 'is-error'
                  : undefined,
                css`
                  outline: none;
                `,
              )}
              placeholder="数量"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
              }}
            />
            <input
              type="text"
              className={cx(
                'nes-input',
                cost && Number.isNaN(parseFloat(cost)) ? 'is-error' : undefined,
                css`
                  outline: none;
                  margin-left: 16px;
                `,
              )}
              placeholder="成本"
              value={cost}
              onChange={(e) => {
                setCost(e.target.value)
              }}
            />
            <button
              type="button"
              className={cx(
                css`
                  margin-left: 16px;
                  flex-shrink: 0;
                `,
                'nes-btn',
                Number.isNaN(parseFloat(amount)) &&
                  Number.isNaN(parseFloat(cost))
                  ? 'is-disabled'
                  : undefined,
              )}
              onClick={async () => {
                await db.items.update([item.type, item.id], {
                  amount: Number.isNaN(parseFloat(amount))
                    ? undefined
                    : parseFloat(amount),
                  cost: Number.isNaN(parseFloat(cost))
                    ? undefined
                    : parseFloat(cost),
                })
                props.onClick()
              }}>
              设置
            </button>
            <button
              type="button"
              className={cx(
                css`
                  margin-left: 16px;
                  flex-shrink: 0;
                `,
                'nes-btn is-warning',
              )}
              onClick={async () => {
                await db.items.delete([item.type, item.id])
                props.onClick()
              }}>
              移除
            </button>
          </div>
        ) : (
          <>
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
                : formatNumber(item.amount * (item.price - (item.cost || 0)))}
            </span>
          </>
        )}
      </td>
    </tr>
  )
}
