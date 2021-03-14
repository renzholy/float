/* eslint-disable jsx-a11y/label-has-associated-control */

import { css, cx } from '@linaria/core'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'

import { useSearch } from '../hooks/use-search'

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
          placeholder="搜索 股票、基金、外汇、数字货币"
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
                  key={item.id + item.type}
                  onClick={async () => {
                    console.log(item)
                    router.push('/')
                  }}>
                  <td className="nes-pointer">
                    {item.name}
                    <br />
                    <span className="nes-text is-disabled">
                      {item.type}
                      &nbsp;
                      {item.label}
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
