/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'

import { usePrice } from '../hooks/use-price'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { Item } from '../libs/types'
import PixelInput from './PixelInput'
import PixelButton from './PixelButton'
import Price from './Price'
import Calculation from './Calculation'
import { IconTrash } from '../assets/icons'

export default function ListItem(props: {
  value: Item
  isExpanded: boolean
  onClick(): void
}) {
  const item = props.value
  const { data: price, isValidating } = usePrice('CNY', item.type, item.id)
  useEffect(() => {
    if (price !== undefined) {
      db.items.update([item.type, item.id], { price })
    }
  }, [item.id, item.type, price])
  useEffect(() => {
    db.items.update([item.type, item.id], { isValidating })
  }, [item.id, item.type, isValidating])
  const [amount, setAmount] = useState('')
  useEffect(() => {
    if (item.amount !== undefined) {
      setAmount(item.amount.toString())
    }
  }, [item.amount])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    throttle(() => {
      db.items.update([item.type, item.id], {
        amount: Number.isNaN(parseFloat(amount)) ? 1 : parseFloat(amount),
      })
    }, 300),
    [amount, item.id, item.type],
  )
  const [cost, setCost] = useState('')
  useEffect(() => {
    if (item.cost !== undefined) {
      setCost(item.cost.toString())
    }
  }, [item.cost])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    throttle(() => {
      db.items.update([item.type, item.id], {
        cost: Number.isNaN(parseFloat(cost)) ? 0 : parseFloat(cost),
      })
    }, 300),
    [cost, item.id, item.type],
  )

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
            <Calculation
              className={css`
                float: right;
              `}>
              {item.cost
                ? `(${formatNumber(item.price)} - ${formatNumber(item.cost)})`
                : formatNumber(item.price)}
              &nbsp;x&nbsp;{formatNumber(item.amount)}&nbsp;=
            </Calculation>
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
          className={css`
            margin-top: -1em;
            display: flex;
            align-items: flex-end;
          `}
          onClick={(e) => {
            e.stopPropagation()
          }}>
          <div
            className={css`
              flex: 1;
              margin-right: 0.5em;
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
              margin-right: 0.5em;
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
          <PixelButton
            icon={<IconTrash />}
            className={css`
              flex-shrink: 0;
            `}
            onClick={async () => {
              if (window.confirm(`确认删除「${item.name}」？`)) {
                await db.items.delete([item.type, item.id])
                props.onClick()
              }
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
