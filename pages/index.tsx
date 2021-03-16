import { css, cx } from '@linaria/core'
import orderBy from 'lodash/orderBy'
import sumBy from 'lodash/sumBy'
import some from 'lodash/some'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { useAtom } from 'jotai'

import ListItem from '../components/ListItem'
import PixelContainer from '../components/PixelContainer'
import PixelButton from '../components/PixelButton'
import Price from '../components/Price'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { ItemType } from '../libs/types'
import { inverseColorAtom } from '../libs/atoms'

const SortableListItem = SortableElement(ListItem)

const SortableListContainer = SortableContainer(
  ({ children }: { children: ReactNode }) => <div>{children}</div>,
)

export default function Index() {
  const router = useRouter()
  const [isSorting, setIsSorting] = useState(false)
  const { data: items, revalidate, mutate } = useSWR(
    'items',
    async () => {
      const array = await db.items.toArray()
      return orderBy(array, 'order')
    },
    {
      refreshInterval: 1000,
      dedupingInterval: 1000,
      isPaused: () => isSorting,
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
  const isValidating = useMemo(() => some(items, (item) => item.isValidating), [
    items,
  ])
  const [expanded, setExpanded] = useState<[ItemType, string]>()
  const handleSortEnd = useCallback(
    async ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      if (!items) {
        setIsSorting(false)
        return
      }
      try {
        const newItems = arrayMove(items, oldIndex, newIndex)
        await mutate(newItems)
        await Promise.all(
          newItems.map((item, index) =>
            db.items.update([item.type, item.id], {
              order: index + 1,
            }),
          ),
        )
      } finally {
        setIsSorting(false)
      }
    },
    [items, mutate],
  )
  const [inverseColor, setInverseColor] = useAtom(inverseColorAtom)

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
            display: flex;
          `}>
          <PixelButton
            className={css`
              margin-right: 1em;
            `}
            onClick={() => {
              setInverseColor((old) => !old)
            }}>
            {inverseColor ? '绿涨红跌' : '红涨绿跌'}
          </PixelButton>
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
      <PixelContainer title={isValidating ? '更新中...' : '浮动收益'}>
        <SortableListContainer
          pressDelay={200}
          onSortEnd={handleSortEnd}
          onSortStart={() => {
            setIsSorting(true)
          }}>
          {items?.map((item, index) => (
            <SortableListItem
              key={item.type + item.id}
              index={index}
              value={item}
              isExpanded={
                item.type === expanded?.[0] && item.id === expanded[1]
              }
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
        </SortableListContainer>
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
