import { css, cx } from '@linaria/core'
import orderBy from 'lodash/orderBy'
import sumBy from 'lodash/sumBy'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { ListItem } from '../components/ListItem'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { ItemType } from '../libs/types'

export default function Index() {
  const router = useRouter()
  const { data: items, revalidate } = useSWR(
    'items',
    async () => {
      const array = await db.items.toArray()
      return orderBy(array, 'order')
    },
    {
      refreshInterval: 2000,
    },
  )
  const totalPrice = useMemo(
    () =>
      sumBy(items, (item) =>
        item.price === undefined ? NaN : item.amount * item.price,
      ),
    [items],
  )
  const totalCost = useMemo(
    () => sumBy(items, (item) => item.amount * (item.cost || 0)),
    [items],
  )
  const [expanded, setExpanded] = useState<[ItemType, string]>()

  return (
    <div
      className={css`
        padding: 16px;
      `}>
      <div className="nes-container with-title">
        <p className="title">Float - 浮动收益</p>
        {items?.map((item) => (
          <ListItem
            key={item.type + item.id}
            value={item}
            isExpanded={item.type === expanded?.[0] && item.id === expanded[1]}
            onClick={() => {
              setExpanded(
                item.type === expanded?.[0] && item.id === expanded[1]
                  ? undefined
                  : [item.type, item.id],
              )
              revalidate()
            }}
          />
        ))}
        <div
          className={css`
            line-height: 1.5;
            margin-bottom: -8px !important;
          `}>
          <span className="nes-text">总计</span>
          {Number.isNaN(totalPrice) || Number.isNaN(totalCost) ? null : (
            <span
              className={cx(
                css`
                  float: right;
                `,
                'nes-text is-disabled',
              )}>
              {formatNumber(totalPrice)} - {formatNumber(totalCost)}
            </span>
          )}
          <br />
          &nbsp;
          <span
            className={cx(
              'nes-text',
              totalPrice - totalCost === 0
                ? undefined
                : totalPrice - totalCost > 0
                ? 'is-error'
                : 'is-success',
              css`
                float: right;
              `,
            )}>
            {formatNumber(totalPrice - totalCost)}
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cx(
          css`
            margin-top: 16px;
          `,
          'nes-btn',
        )}
        onClick={() => {
          router.push('/search')
        }}>
        添加
      </button>
    </div>
  )
}
