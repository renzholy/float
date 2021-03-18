/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import maxBy from 'lodash/maxBy'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { useSearch } from '../hooks/use-search'
import db from '../libs/db'
import PixelInput from '../components/PixelInput'
import PixelContainer from '../components/PixelContainer'
import PixelButton from '../components/PixelButton'
import { IconClose } from '../assets/icons'
import { getFontClassName } from '../libs/font'
import { largeFontAtom } from '../libs/atoms'
import { Currency, ItemType } from '../libs/types'

export default function Search() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const { data, isValidating } = useSearch(keyword)
  const [largeFont, setLargeFont] = useAtom(largeFontAtom)
  const fontClassName = getFontClassName(largeFont)
  useEffect(() => {
    setLargeFont(localStorage.getItem('largeFont') === 'true')
  }, [setLargeFont])

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
          margin-bottom: 1em;
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
      {data.length || keyword ? (
        <PixelContainer title={isValidating ? '搜索中...' : '搜索结果'}>
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

                    &:hover .item-hover {
                      color: var(--color-primary-0);
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
                  {item.type}
                  &nbsp;
                  {item.code}
                </span>
              </div>
            ))}
          </div>
        </PixelContainer>
      ) : null}
    </div>
  )
}
