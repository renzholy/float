/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { cx, css } from '@linaria/core'
import { useAtom } from 'jotai'
import { sumBy } from 'lodash'
import React, { useMemo } from 'react'

import { useRates } from '../hooks/use-rates'
import { currencyAtom } from '../libs/atoms'
import { Currency, Item, ProfitMode } from '../libs/types'
import Calculation from './Calculation'
import Profit from './Profit'

export default function Total(props: {
  profitMode: ProfitMode
  items?: Item[]
}) {
  const [currency, setCurrency] = useAtom(currencyAtom)
  const rates = useRates()
  const totalPrice = useMemo(
    () =>
      sumBy(props.items, (item) =>
        item.price === undefined
          ? NaN
          : (item.amount * item.price * rates[currency]) / rates[item.currency],
      ),
    [currency, props.items, rates],
  )
  const totalCost = useMemo(
    () =>
      sumBy(
        props.items,
        (item) =>
          (item.amount * (item.cost || 0) * rates[currency]) /
          rates[item.currency],
      ),
    [currency, props.items, rates],
  )

  return (
    <div
      className={cx(
        css`
          line-height: 1.5;
          display: flex;
          flex-direction: column;
          @media (hover: hover) and (pointer: fine) {
            &:hover .item-hover {
              color: var(--color-primary-0);
            }
          }
          &:active .item-hover {
            color: var(--color-primary-1);
          }
        `,
        'nes-pointer',
      )}
      onClick={() => {
        setCurrency(
          (old) => ({ CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[old] as Currency),
        )
      }}>
      <span className="item-hover">总计</span>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}>
        <span
          className={css`
            color: var(--color-gray-1);
          `}>
          {currency}
        </span>
        {props.profitMode === 'SHOW' ? (
          <Calculation
            className={css`
              align-self: flex-end;
            `}
            price={totalPrice}
            cost={totalCost}
            currency={currency}
          />
        ) : null}
      </div>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}>
        <span
          className={css`
            color: var(--color-gray-1);
          `}>
          100%
        </span>
        <Profit
          className={css`
            align-self: flex-end;
          `}
          price={totalPrice}
          cost={totalCost}
          amount={1}
          currency={currency}
        />
      </div>
    </div>
  )
}
