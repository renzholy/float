/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@emotion/css'
import React, { useCallback, useEffect, useState } from 'react'
import numeral from 'numeral'

import { usePrice } from '../hooks/use-price'
import db from '../libs/db'
import { Currency, Item, ItemType } from '../libs/types'
import PixelInput from './pixel-input'
import PixelButton from './pixel-button'
import Profit from './profit'
import Calculation from './calculation'
import { IconTrash } from './icons'
import { useRates } from '../hooks/use-rates'
import PixelNumericInput from './pixel-numeric-input'

export default function ListItem(props: {
  totalPirce: number
  totalCost: number
  value: Item
  isExpanded: boolean
  onClick(): void
  className?: string
}) {
  const item = props.value
  const rates = useRates()
  const { data, isValidating } = usePrice(
    props.value.currency,
    item.type,
    item.id,
  )
  useEffect(() => {
    if (data !== undefined) {
      db.items.update([item.type, item.id], { price: data })
    }
  }, [item.id, item.type, data])
  useEffect(() => {
    db.items.update([item.type, item.id], { isValidating })
  }, [item.id, item.type, isValidating])
  // Name
  const [name, setName] = useState('')
  useEffect(() => {
    if (item.type !== ItemType.CUSTOM) {
      return
    }
    setName(item.name)
  }, [item.name, item.type])
  useEffect(() => {
    if (!props.isExpanded || item.type !== ItemType.CUSTOM) {
      return
    }
    db.items.update([item.type, item.id], {
      name,
    })
  }, [name, item.id, item.type, props.isExpanded])
  // Price
  const [price, setPrice] = useState<number>()
  useEffect(() => {
    if (item.type !== ItemType.CUSTOM) {
      return
    }
    setPrice(item.price)
  }, [item.price, item.type])
  useEffect(() => {
    if (
      !props.isExpanded ||
      price === undefined ||
      item.type !== ItemType.CUSTOM
    ) {
      return
    }
    db.items.update([item.type, item.id], {
      price,
    })
  }, [price, item.id, item.type, props.isExpanded])
  // Amount
  const [amount, setAmount] = useState<number>()
  useEffect(() => {
    setAmount(item.amount)
  }, [item.amount])
  useEffect(() => {
    if (!props.isExpanded || amount === undefined) {
      return
    }
    db.items.update([item.type, item.id], {
      amount,
    })
  }, [amount, item.id, item.type, props.isExpanded])
  // Cost
  const [cost, setCost] = useState<number>()
  useEffect(() => {
    setCost(item.cost)
  }, [item.cost])
  useEffect(() => {
    if (!props.isExpanded || cost === undefined) {
      return
    }
    db.items.update([item.type, item.id], {
      cost,
    })
  }, [cost, item.id, item.type, props.isExpanded])
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
  const renderCurrency = useCallback(
    () => (
      <span
        className={cx(
          'nes-pointer',
          css`
            text-align: center;
            color: var(--color-gray-1);
            @media (hover: hover) and (pointer: fine) {
              &:hover {
                box-shadow: 0 0.125em 0 var(--color-gray-2);
              }
            }
            &:active {
              box-shadow: 0 0.125em 0 var(--color-gray-1);
            }
          `,
        )}
        onClick={() => {
          setCurrency(
            (old) => ({ CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[old] as Currency),
          )
          setCost((old) =>
            old === undefined
              ? undefined
              : (old / rates[currency]) *
                rates[
                  { CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[currency] as Currency
                ],
          )
          if (item.type === ItemType.CUSTOM) {
            setPrice((old) =>
              old === undefined
                ? undefined
                : (old / rates[currency]) *
                  rates[
                    { CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[currency] as Currency
                  ],
            )
          }
        }}
      >
        {currency}
      </span>
    ),
    [currency, item.type, rates],
  )

  return (
    <div
      className={cx(
        props.isExpanded
          ? css`
              .item-hover {
                color: var(--color-primary-0) !important;
              }
            `
          : undefined,
        css`
          @media (hover: hover) and (pointer: fine) {
            &:hover .item-hover {
              color: var(--color-primary-0);
            }
          }
          &:active .item-hover {
            color: var(--color-primary-1);
          }
        `,
        props.className,
      )}
    >
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
        onClick={props.onClick}
      >
        <span className="item-hover">{item.name}</span>
        <div>
          <span
            className={css`
              color: var(--color-gray-1);
            `}
          >
            {item.code ? `${item.code} ` : ''}
            {item.type}
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
        <div
          className={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <span
            className={css`
              color: var(--color-gray-2);
            `}
          >
            {numeral(
              (item.amount * item.cost) / rates[currency] / props.totalCost,
            ).format('0,0.0%')}
            &nbsp;→&nbsp;
            {item.price === undefined
              ? '-'
              : numeral(
                  (item.amount * item.price) /
                    rates[currency] /
                    props.totalPirce,
                ).format('0,0.0%')}
          </span>
          <Profit
            price={item.price}
            cost={item.cost}
            amount={item.amount}
            currency={item.currency}
          />
        </div>
      </div>
      {props.isExpanded ? (
        <>
          {props.value.type === ItemType.CUSTOM ? (
            <div
              className={css`
                display: flex;
                align-items: flex-end;
                margin-bottom: 1em;
                margin-right: 3em;
              `}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div
                className={css`
                  flex: 1;
                  margin-right: 0.5em;
                `}
              >
                <label
                  className={css`
                    white-space: nowrap;
                    margin-bottom: 0.5em;
                    display: block;
                  `}
                >
                  名称
                </label>
                <PixelInput isError={!name} value={name} onChange={setName} />
              </div>
              <div
                className={css`
                  flex: 1;
                  margin-right: 0.5em;
                `}
              >
                <label
                  className={css`
                    white-space: nowrap;
                    margin-bottom: 0.5em;
                    display: block;
                  `}
                >
                  单价&nbsp;{renderCurrency()}
                </label>
                <PixelNumericInput value={price} onChange={setPrice} />
              </div>
            </div>
          ) : null}
          <div
            className={css`
              display: flex;
              align-items: flex-end;
            `}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div
              className={css`
                flex: 1;
                margin-right: 0.5em;
              `}
            >
              <label
                className={css`
                  white-space: nowrap;
                  margin-bottom: 0.5em;
                  display: block;
                `}
              >
                数量
              </label>
              <PixelNumericInput value={amount} onChange={setAmount} />
            </div>
            <div
              className={css`
                flex: 1;
                margin-right: 0.5em;
              `}
            >
              <label
                className={css`
                  white-space: nowrap;
                  margin-bottom: 0.5em;
                  display: block;
                `}
              >
                成本&nbsp;{renderCurrency()}
              </label>
              <PixelNumericInput value={cost} onChange={setCost} />
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
        </>
      ) : null}
    </div>
  )
}
