import { css, cx } from '@linaria/core'
import orderBy from 'lodash/orderBy'
import sumBy from 'lodash/sumBy'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import ListItem from '../components/ListItem'
import PixelContainer from '../components/PixelContainer'
import PixelButton from '../components/PixelButton'
import Price from '../components/Price'
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
        padding: 1em;
      `}>
      <div
        className={css`
          margin-bottom: 1em;
          display: flex;
          justify-content: space-between;
        `}>
        <PixelButton
          onClick={() => {
            router.push('/search')
          }}>
          添加
        </PixelButton>
        <span
          className={css`
            line-height: 0;
          `}>
          <a
            href="https://twitter.com/RenzHoly"
            target="_black"
            className={css`
              appearance: none;
              display: inline-block;
              line-height: 0;
              margin-right: 1em;
            `}>
            <img
              src="/twitter.svg"
              alt="twitter"
              className={cx(
                'nes-pointer',
                css`
                  height: 3em;
                  width: 3em;
                `,
              )}
            />
          </a>
          <a
            href="https://github.com/RenzHoly"
            target="_black"
            className={css`
              appearance: none;
              display: inline-block;
              line-height: 0;
            `}>
            <img
              src="/github.svg"
              alt="github"
              className={cx(
                'nes-pointer',
                css`
                  height: 3em;
                  width: 3em;
                `,
              )}
            />
          </a>
        </span>
      </div>
      <PixelContainer title="浮动收益">
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
            margin-bottom: -0.5em !important;
          `}>
          <span>总计</span>
          <br />
          {Number.isNaN(totalPrice) || Number.isNaN(totalCost) ? null : (
            <span
              className={css`
                float: right;
                color: #d3d3d3;
              `}>
              {formatNumber(totalPrice)}&nbsp;-&nbsp;{formatNumber(totalCost)}
              &nbsp;=
            </span>
          )}
          <br />
          &nbsp;
          <Price
            value={totalPrice - totalCost}
            className={css`
              float: right;
            `}
          />
        </div>
      </PixelContainer>
    </div>
  )
}
