/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import Profit from '../components/Profit'
import PixelLogo from '../components/PixelLogo'
import Calculation from '../components/Calculation'
import db from '../libs/db'
import { Currency, ItemType, ProfitMode } from '../libs/types'
import {
  profitModeAtom,
  inverseColorAtom,
  largeFontAtom,
  currencyAtom,
} from '../libs/atoms'
import {
  IconAdd,
  IconFontSize,
  IconFontSizeLarge,
  IconGithub,
  IconInvisible,
  IconJike,
  IconPercentage,
  IconPriceColor,
  IconPriceColorInverse,
  IconTwitter,
  IconVisible,
} from '../assets/icons'
import { getFontClassName } from '../libs/font'
import { useRates } from '../hooks/use-rates'

const SortableListItem = SortableElement(ListItem)

const SortableListContainer = SortableContainer(
  ({ children }: { children: ReactNode }) => <div>{children}</div>,
)

export default function Index() {
  const router = useRouter()
  const [inverseColor, setInverseColor] = useAtom(inverseColorAtom)
  const [profitMode, setProfitMode] = useAtom(profitModeAtom)
  const [largeFont, setLargeFont] = useAtom(largeFontAtom)
  const [currency, setCurrency] = useAtom(currencyAtom)
  useEffect(() => {
    setInverseColor(localStorage.getItem('inverseColor') === 'true')
    setProfitMode((localStorage.getItem('profitMode') || 'SHOW') as ProfitMode)
    setLargeFont(localStorage.getItem('largeFont') === 'true')
    setCurrency((localStorage.getItem('currency') || 'CNY') as Currency)
  }, [setInverseColor, setProfitMode, setLargeFont, setCurrency])
  useEffect(() => {
    localStorage.setItem('inverseColor', inverseColor ? 'true' : 'false')
  }, [inverseColor])
  useEffect(() => {
    localStorage.setItem('profitMode', profitMode)
  }, [profitMode])
  useEffect(() => {
    localStorage.setItem('largeFont', largeFont ? 'true' : 'false')
  }, [largeFont])
  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])
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
  const rates = useRates()
  const totalPrice = useMemo(
    () =>
      sumBy(items, (item) =>
        item.price === undefined
          ? NaN
          : (item.amount * item.price * rates[currency]) / rates[item.currency],
      ),
    [currency, items, rates],
  )
  const totalCost = useMemo(
    () =>
      sumBy(
        items,
        (item) =>
          (item.amount * (item.cost || 0) * rates[currency]) /
          rates[item.currency],
      ),
    [currency, items, rates],
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
  const fontClassName = getFontClassName(largeFont)
  useEffect(() => {
    setExpanded(undefined)
    return () => {
      setExpanded(undefined)
    }
  }, [])

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
            icon={
              {
                SHOW: <IconVisible />,
                HIDE: <IconInvisible />,
                PERCENTAGE: <IconPercentage />,
              }[profitMode]
            }
            className={cx(
              'nes-pointer',
              css`
                height: 3em;
                width: 3em;
              `,
            )}
            onClick={() => {
              setProfitMode(
                (old) =>
                  ({
                    SHOW: 'HIDE',
                    HIDE: 'PERCENTAGE',
                    PERCENTAGE: 'SHOW',
                  }[old] as ProfitMode),
              )
            }}
          />
        </span>
      </div>
      <PixelContainer title={isValidating ? '更新中…' : '浮动收益'}>
        <SortableListContainer
          axis="y"
          lockAxis="y"
          helperClass={fontClassName}
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
          className={cx(
            css`
              line-height: 1.5;
              margin-bottom: -0.5em;
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
              (old) =>
                ({ CNY: 'USD', USD: 'HKD', HKD: 'CNY' }[old] as Currency),
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
            <Calculation
              className={css`
                align-self: flex-end;
              `}
              price={totalPrice}
              cost={totalCost}
              currency={currency}
            />
          </div>
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
      </PixelContainer>
      <div
        className={css`
          margin-top: 1em;
          display: flex;
          justify-content: flex-end;
        `}>
        <PixelLogo
          href="https://m.okjike.com/users/d25026f2-18ce-48aa-9ea7-c05a25446368"
          className={css`
            margin-right: 1em;
          `}
          icon={<IconJike />}
        />
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
