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
      `}>
      <div
        className={css`
          display: flex;
          margin-bottom: 12px;
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
          id="name_field"
          className={cx(
            'nes-input',
            css`
              outline: none;
            `,
          )}
          placeholder="搜索 股票、基金、外汇、加密货币"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
        />
      </div>
      {data.length ? (
        <div className="nes-table-responsive">
          <table
            className={cx(
              'nes-table is-bordered',
              css`
                width: -webkit-fill-available;
                & td {
                  vertical-align: top;
                  line-height: 1.25;
                }
                & td:hover {
                  color: #209cee;
                }
                & td:active {
                  color: #006bb3;
                }
              `,
            )}>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.type + item.id}
                  onClick={async () => {
                    const items = await db.items.toArray()
                    const order = (maxBy(items, 'order')?.order || 0) + 1
                    await db.items.put({ ...item, order, amount: 1 }, [
                      item.type,
                      item.id,
                    ])
                    router.push('/')
                  }}>
                  <td className="nes-pointer">
                    {item.name}
                    <br />
                    <span className="nes-text is-disabled">
                      {item.type}
                      &nbsp;
                      {item.code}
                    </span>
                    <span
                      className={css`
                        float: right;
                      `}>
                      +
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
