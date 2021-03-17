/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'

import { usePrice } from '../hooks/use-price'
import db from '../libs/db'
import { Currency, Item } from '../libs/types'
import PixelInput from './PixelInput'
import PixelButton from './PixelButton'
import Profit from './Profit'
import Calculation from './Calculation'
import { IconTrash } from '../assets/icons'
import { useRates } from '../hooks/use-rates'

export default function ListItem(props: {
  value: Item
  isExpanded: boolean
  onClick(): void
}) {
  const item = props.value
  const rates = useRates()
  const { data: price, isValidating } = usePrice(
    props.value.currency,
    item.type,
    item.id,
  )
  useEffect(() => {
    if (price !== undefined) {
      db.items.update([item.type, item.id], { price })
    }
  }, [item.id, item.type, price])
  useEffect(() => {
    db.items.update([item.type, item.id], { isValidating })
  }, [item.id, item.type, isValidating])
  // Amount
  const [amount, setAmount] = useState('')
  useEffect(() => {
    if (item.amount !== undefined) {
      setAmount(item.amount.toString())
    }
  }, [item.amount])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    throttle(
      () => {
        if (!props.isExpanded) {
          return
        }
        db.items.update([item.type, item.id], {
          amount: Number.isNaN(parseFloat(amount)) ? 1 : parseFloat(amount),
        })
      },
      300,
      {
        leading: true,
        trailing: true,
      },
    ),
    [amount, item.id, item.type, props.isExpanded],
  )
  // Cost
  const [cost, setCost] = useState('')
  useEffect(() => {
    if (item.cost !== undefined) {
      setCost(item.cost.toString())
    }
  }, [item.cost])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    throttle(
      () => {
        if (!props.isExpanded) {
          return
        }
        db.items.update([item.type, item.id], {
          cost: Number.isNaN(parseFloat(cost)) ? 0 : parseFloat(cost),
        })
      },
      300,
      {
        leading: true,
        trailing: true,
      },
    ),
    [cost, item.id, item.type, props.isExpanded],
  )
  // Currency
  const [currency, setCurrency] = useState<Currency>('CNY')
  useEffect(() => {
    setCurrency(item.currency || 'CNY')
  }, [item.currency])
  useEffect(() => {
    if (!props.isExpanded) {
      return
    }
    db.items.update([item.type, item.id], {
      currency,
    })
  }, [currency, item.id, item.type, props.isExpanded])

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
          <Calculation
            className={css`
              float: right;
            `}
            price={item.price}
            cost={item.cost}
            amount={item.amount}
            currency={item.currency}
          />
        </div>
        <Profit
          className={css`
            align-self: flex-end;
          `}
          price={item.price}
          cost={item.cost}
          amount={item.amount}
          currency={item.currency}
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
              成本&nbsp;
              <span
                className={cx(
                  'nes-pointer',
                  css`
                    text-align: center;
                    color: #adafbc;
                    &:hover {
                      box-shadow: 0 0.125em 0 #d3d3d3;
                    }
                    &:active {
                      box-shadow: 0 0.125em 0 #adafbc;
                    }
                  `,
                )}
                onClick={() => {
                  setCurrency(
                    (old) =>
                      ({ CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[old] as Currency),
                  )
                  setCost((old) =>
                    (
                      (parseFloat(old) / rates[currency]) *
                      rates[
                        { CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[
                          currency
                        ] as Currency
                      ]
                    ).toString(),
                  )
                }}>
                {currency}
              </span>
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
