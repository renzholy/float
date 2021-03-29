/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import maxBy from 'lodash/maxBy'
import omit from 'lodash/omit'
import { useRouter } from 'next/dist/client/router'
import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { useSearch } from '../hooks/use-search'
import db from '../libs/db'
import PixelInput from '../components/PixelInput'
import PixelContainer from '../components/PixelContainer'
import PixelButton from '../components/PixelButton'
import { IconClose, IconExport, IconImport } from '../assets/icons'
import { getFontClassName } from '../libs/font'
import { largeFontAtom } from '../libs/atoms'
import { Currency, Item, ItemType } from '../libs/types'

export default function Search() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const { data, isValidating } = useSearch(keyword)
  const [largeFont, setLargeFont] = useAtom(largeFontAtom)
  const fontClassName = getFontClassName(largeFont)
  useEffect(() => {
    setLargeFont(localStorage.getItem('largeFont') === 'true')
  }, [setLargeFont])
  const handleImport = useCallback(async () => {
    const str = prompt('输入需要导入的数据，重复的数据将被覆盖')
    if (!str) {
      return
    }
    try {
      const items = JSON.parse(str) as Item[]
      await Promise.all(
        items.map((item) => db.items.put(item, [item.type, item.id])),
      )
      alert('导入成功')
      router.push('/')
    } catch (err) {
      console.error(err)
      alert('解析数据出错')
    }
  }, [router])
  const handleExport = useCallback(async () => {
    const items = await db.items.toArray()
    await navigator.clipboard.writeText(
      JSON.stringify(items.map((item) => omit(item, 'isValidating'))),
    )
    alert('已导出到剪贴板')
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
          display: flex;
        `}>
        <PixelButton
          icon={<IconClose />}
          className={css`
            margin-right: 1em;
            flex-shrink: 0;
          `}
          onClick={() => {
            router.push('/')
          }}
        />
        <PixelInput
          autoFocus={true}
          placeholder="股票 基金 外汇 加密货币"
          value={keyword}
          onChange={setKeyword}
        />
      </div>
      <PixelContainer
        title={isValidating ? '搜索中…' : '搜索结果'}
        className={css`
          margin-top: 1em;
        `}>
        <div
          className={css`
            & > div + div {
              margin-top: 1em;
            }
          `}>
          {data.map((item) => (
            <div
              className={cx(
                css`
                  line-height: 1.5;
                  word-break: break-all;
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
              key={item.type + item.id}
              onClick={async () => {
                const items = await db.items.toArray()
                const order = (maxBy(items, 'order')?.order || 0) + 1
                await db.items.put(
                  {
                    ...item,
                    order,
                    amount: 1,
                    cost: 0,
                    currency: {
                      [ItemType.FOREX]: 'CNY',
                      [ItemType.CRYPTO]: 'USD',
                      [ItemType.STOCK_CN]: 'CNY',
                      [ItemType.STOCK_HK]: 'HKD',
                      [ItemType.STOCK_US]: 'USD',
                      [ItemType.FUND]: 'CNY',
                    }[item.type] as Currency,
                  },
                  [item.type, item.id],
                )
                router.push('/')
              }}>
              <span className="item-hover">{item.name}</span>
              <br />
              <span
                className={css`
                  color: var(--color-gray-1);
                `}>
                {item.code}
                &nbsp;
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </PixelContainer>
      <div
        className={css`
          margin-top: 1em;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        `}>
        <PixelButton icon={<IconExport />} onClick={handleExport} />
        <PixelButton
          className={css`
            margin-left: 1em;
          `}
          icon={<IconImport />}
          onClick={handleImport}
        />
      </div>
    </div>
  )
}
