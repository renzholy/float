/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { css, cx } from '@linaria/core'
import orderBy from 'lodash/orderBy'
import sumBy from 'lodash/sumBy'
import some from 'lodash/some'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { useAtom } from 'jotai'

import ListItem from '../components/ListItem'
import PixelContainer from '../components/PixelContainer'
import PixelButton from '../components/PixelButton'
import Price from '../components/Price'
import PixelLogo from '../components/PixelLogo'
import Calculation from '../components/Calculation'
import db from '../libs/db'
import { ItemType } from '../libs/types'
import { hidePriceAtom, inverseColorAtom, largeFontAtom } from '../libs/atoms'
import {
  IconAdd,
  IconFontSize,
  IconFontSizeLarge,
  IconGithub,
  IconInvisible,
  IconPriceColor,
  IconPriceColorInverse,
  IconTwitter,
  IconVisible,
} from '../assets/icons'
import { getFontClassName } from '../libs/font'

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
  const [hidePrice, setHidePrice] = useAtom(hidePriceAtom)
  const [largeFont, setLargeFont] = useAtom(largeFontAtom)
  useEffect(() => {
    db.config.toArray().then((configs) =>
      configs.map((config) => {
        if (config.key === 'inverseColor') {
          setInverseColor(config.value)
        } else if (config.key === 'hidePrice') {
          setHidePrice(config.value)
        } else if (config.key === 'largeFont') {
          setLargeFont(config.value)
        }
        return undefined
      }),
    )
  }, [setInverseColor, setHidePrice, setLargeFont])
  useEffect(() => {
    db.config.put({ key: 'inverseColor', value: inverseColor })
  }, [inverseColor])
  useEffect(() => {
    db.config.put({ key: 'hidePrice', value: hidePrice })
  }, [hidePrice])
  useEffect(() => {
    db.config.put({ key: 'largeFont', value: largeFont })
  }, [largeFont])
  const fontClassName = getFontClassName(largeFont)

  return (
    <div
      className={cx(
        css`
          padding: 1em;
        `,
        fontClassName,
      )}>
      <div
        className={css`
          margin-bottom: 1em;
          display: flex;
          justify-content: space-between;
        `}>
        <PixelButton
          icon={<IconAdd />}
          onClick={() => {
            router.push('/search')
          }}
        />
        <span
          className={css`
            line-height: 0;
            display: flex;
          `}>
          <PixelButton
            icon={largeFont ? <IconFontSizeLarge /> : <IconFontSize />}
            className={cx(
              'nes-pointer',
              css`
                height: 3em;
                width: 3em;
                margin-right: 1em;
              `,
            )}
            onClick={() => {
              setLargeFont((old) => !old)
            }}
          />
          <PixelButton
            icon={inverseColor ? <IconPriceColorInverse /> : <IconPriceColor />}
            className={cx(
              'nes-pointer',
              css`
                height: 3em;
                width: 3em;
                margin-right: 1em;
              `,
            )}
            onClick={() => {
              setInverseColor((old) => !old)
            }}
          />
          <PixelButton
            icon={hidePrice ? <IconInvisible /> : <IconVisible />}
            className={cx(
              'nes-pointer',
              css`
                height: 3em;
                width: 3em;
              `,
            )}
            onClick={() => {
              setHidePrice((old) => !old)
            }}
          />
        </span>
      </div>
      <PixelContainer title={isValidating ? '更新中...' : '浮动收益'}>
        <SortableListContainer
          helperClass="hoc-helper"
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
            <Calculation
              className={css`
                float: right;
              `}
              x={totalPrice}
              y={totalCost}
            />
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
      <div
        className={css`
          margin-top: 1em;
          display: flex;
          justify-content: flex-end;
        `}>
        <PixelLogo
          href="https://twitter.com/RenzHoly"
          className={css`
            margin-right: 1em;
          `}
          icon={<IconTwitter />}
        />
        <PixelLogo icon={<IconGithub />} href="https://github.com/RenzHoly" />
      </div>
    </div>
  )
}
