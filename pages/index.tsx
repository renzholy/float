import { css, cx } from '@emotion/css'
import orderBy from 'lodash/orderBy'
import some from 'lodash/some'
import sumBy from 'lodash/sumBy'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'
import { useAtom } from 'jotai'

import ListItem from '../components/list-item'
import PixelContainer from '../components/pixel-container'
import PixelButton from '../components/pixel-button'
import PixelLogo from '../components/pixel-logo'
import Total from '../components/total'
import db from '../libs/db'
import { Currency, ItemType, ProfitMode } from '../libs/types'
import {
  currencyAtom,
  inverseColorAtom,
  largeFontAtom,
  profitModeAtom,
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
} from '../components/icons'
import { getFontClassName } from '../libs/font'
import EasterEgg from '../components/easter-egg'
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
  const { data: items, mutate } = useSWR(
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
  const isValidating = useMemo(
    () => some(items, (item) => item.isValidating),
    [items],
  )
  const [expanded, setExpanded] = useState<[ItemType, string]>()
  const handleSortEnd = useCallback(
    async ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      if (!items) {
        setIsSorting(false)
        return
      }
      try {
        const newItems = arrayMoveImmutable(items, oldIndex, newIndex)
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
  const rates = useRates()
  const totalPirce = useMemo(
    () =>
      sumBy(items, (item) =>
        item.price === undefined
          ? NaN
          : (item.amount * item.price) / rates[item.currency],
      ),
    [items, rates],
  )
  const totalCost = useMemo(
    () =>
      sumBy(items, (item) => (item.amount * item.cost) / rates[item.currency]),
    [items, rates],
  )

  return (
    <div
      className={cx(
        css`
          padding: 1em;
        `,
        fontClassName,
      )}
    >
      <div
        className={css`
          margin-bottom: 1em;
          display: flex;
          justify-content: space-between;
        `}
      >
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
          `}
        >
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
        <Total items={items} profitMode={profitMode} />
        <SortableListContainer
          axis="y"
          lockAxis="y"
          helperClass={fontClassName}
          pressDelay={200}
          onSortEnd={handleSortEnd}
          onSortStart={() => {
            setIsSorting(true)
          }}
        >
          {items?.map((item, index) => (
            <SortableListItem
              key={item.type + item.id}
              index={index}
              value={item}
              totalPirce={totalPirce}
              totalCost={totalCost}
              isExpanded={
                item.type === expanded?.[0] && item.id === expanded[1]
              }
              onClick={() => {
                setExpanded(
                  item.type === expanded?.[0] && item.id === expanded[1]
                    ? undefined
                    : [item.type, item.id],
                )
                mutate()
              }}
              className={css`
                margin-top: 2em;
              `}
            />
          ))}
        </SortableListContainer>
      </PixelContainer>
      <div
        className={css`
          margin-top: 1em;
          display: flex;
          justify-content: space-between;
          line-height: 0;
        `}
      >
        <EasterEgg />
        <div>
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
    </div>
  )
}
