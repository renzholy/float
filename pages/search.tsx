/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { css, cx } from '@linaria/core'
import maxBy from 'lodash/maxBy'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'

import { useSearch } from '../hooks/use-search'
import db from '../libs/db'

export default function Search() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const { data } = useSearch(keyword)

  return (
    <div
      className={css`
        padding: 16px;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
      `}>
      <div
        className={css`
          display: flex;
          margin-bottom: 12px;
          flex-shrink: 0;
        `}>
        <button
          type="button"
          className={cx(
            'nes-btn',
            css`
              margin-right: 16px;
              flex-shrink: 0;
            `,
          )}
          onClick={() => {
            router.push('/')
          }}>
          返回
        </button>
        <input
          type="text"
          autoFocus={true}
          className={cx(
            'nes-input',
            css`
              outline: none;
            `,
          )}
          placeholder="股票 基金 外汇 加密货币"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
        />
      </div>
      {data.length ? (
        <div
          className={cx(
            'nes-container with-title',
            css`
              flex: 1;
              height: 0;
            `,
          )}>
          <p className="title">搜索结果</p>
          <ul
            className={cx(
              'nes-list is-circle',
              css`
                margin-left: -32px;
                overflow-x: visible;
                overflow-y: scroll;
                height: 100%;

                li + li {
                  margin-top: 16px;
                }
              `,
            )}>
            {data.map((item) => (
              <li
                className={cx(
                  css`
                    line-height: 1.5;
                    word-break: break-all;

                    &::before {
                      top: 4px !important;
                    }

                    &:hover::before {
                      box-shadow: 8px 2px, 10px 2px, 6px 4px, 8px 4px, 10px 4px,
                        12px 4px, 4px 6px, 6px 6px, 8px 6px, 10px 6px, 12px 6px,
                        14px 6px, 4px 8px, 6px 8px, 8px 8px, 10px 8px, 12px 8px,
                        14px 8px, 6px 10px, 8px 10px, 10px 10px, 12px 10px,
                        8px 12px, 10px 12px !important;
                    }

                    &:active::before {
                      box-shadow: 8px 2px, 10px 2px, 6px 4px, 8px 4px, 10px 4px,
                        12px 4px, 4px 6px, 6px 6px, 8px 6px, 10px 6px, 12px 6px,
                        14px 6px, 4px 8px, 6px 8px, 8px 8px, 10px 8px, 12px 8px,
                        14px 8px, 6px 10px, 8px 10px, 10px 10px, 12px 10px,
                        8px 12px, 10px 12px !important;
                    }
                  `,
                  'nes-pointer',
                )}
                key={item.type + item.id}
                onClick={async () => {
                  const items = await db.items.toArray()
                  const order = (maxBy(items, 'order')?.order || 0) + 1
                  await db.items.put({ ...item, order, amount: 1, cost: 0 }, [
                    item.type,
                    item.id,
                  ])
                  router.push('/')
                }}>
                {item.name}
                <br />
                <span className="nes-text is-disabled">
                  {item.type}
                  &nbsp;
                  {item.code}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
