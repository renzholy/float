/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import { useEffect, useState } from 'react'

import { usePrice } from '../hooks/use-price'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { Item } from '../libs/types'
import PixelInput from './PixelInput'
import PixelButton from './PixelButton'
import Price from './Price'

export default function ListItem(props: {
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
    <div
      className={cx(
        props.isExpanded
          ? css`
              .item-hover {
                color: #209cee;
              }
            `
          : undefined,
        css`
          margin-bottom: 1em;

          &:hover .item-hover {
            color: #209cee;
          }

          &:active .item-hover {
            color: #006bb3;
          }
        `,
      )}>
      <div
        className={cx(
          'nes-pointer',
          css`
            line-height: 1.5;
            word-break: break-all;
            display: flex;
            flex-direction: column;
          `,
        )}
        onClick={props.onClick}>
        <span className="item-hover">{item.name}</span>
        <div>
          <span
            className={css`
              color: #adafbc;
            `}>
            {item.type}
            &nbsp;
            {item.code}
          </span>
          {item.price === undefined ? null : (
            <span
              className={css`
                color: #d3d3d3;
                float: right;
              `}>
              {item.cost
                ? `(${formatNumber(item.price)} - ${formatNumber(item.cost)})`
                : formatNumber(item.price)}
              &nbsp;x&nbsp;{formatNumber(item.amount)}&nbsp;=
            </span>
          )}
        </div>
        <Price
          className={css`
            align-self: flex-end;
          `}
          value={
            item.price === undefined
              ? undefined
              : item.amount * (item.price - (item.cost || 0))
          }
        />
        <br />
      </div>
      {props.isExpanded ? (
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}>
          <div
            className={css`
              margin-top: -1em;
              display: flex;
            `}>
            <div
              className={css`
                flex: 1;
                margin-right: 0.25em;
              `}>
              <label
                className={css`
                  white-space: nowrap;
                  margin-bottom: 0.5em;
                  display: block;
                `}>
                数量
              </label>
              <PixelInput
                isError={!!amount && Number.isNaN(parseFloat(amount))}
                placeholder="数量"
                value={amount}
                onChange={setAmount}
              />
            </div>
            <div
              className={css`
                flex: 1;
                margin-left: 0.25em;
              `}>
              <label
                className={css`
                  white-space: nowrap;
                  margin-bottom: 0.5em;
                  display: block;
                `}>
                成本
              </label>
              <PixelInput
                isError={!!cost && Number.isNaN(parseFloat(cost))}
                value={cost}
                onChange={setCost}
              />
            </div>
          </div>
          <PixelButton
            className={css`
              margin-top: 0.5em;
            `}
            disabled={
              Number.isNaN(parseFloat(amount)) || Number.isNaN(parseFloat(cost))
            }
            intent="success"
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
            保存
          </PixelButton>
          <PixelButton
            className={css`
              margin-top: 0.5em;
              float: right;
            `}
            onClick={async () => {
              await db.items.delete([item.type, item.id])
              props.onClick()
            }}>
            移除
          </PixelButton>
        </div>
      ) : null}
    </div>
  )
}
