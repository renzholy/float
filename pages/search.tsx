/* eslint-disable jsx-a11y/label-has-associated-control */

import { css, cx } from '@linaria/core'
import { useState } from 'react'

import { useSearch } from '../hooks/use-search'

export default function Search() {
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
          margin-bottom: 8px;
        `}>
        <input
          type="text"
          id="name_field"
          className={cx(
            'nes-input',
            css`
              outline: none;
            `,
          )}
          placeholder="股票、基金、外汇、数字货币"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
        />
        <button
          type="button"
          className={cx(
            'nes-btn',
            keyword ? 'is-primary' : 'is-disabled',
            css`
              margin-left: 12px;
              flex-shrink: 0;
            `,
          )}>
          搜索
        </button>
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
                }
              `,
            )}>
            <thead>
              <tr>
                <th>名称</th>
                <th>代码</th>
                <th>类型</th>
                <th
                  className={css`
                    white-space: nowrap;
                  `}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id + item.type}>
                  <td>{item.name}</td>
                  <td
                    className={css`
                      white-space: nowrap;
                    `}>
                    {item.label}
                  </td>
                  <td
                    className={css`
                      white-space: nowrap;
                    `}>
                    {item.type}
                  </td>
                  <td
                    align="center"
                    className={cx(
                      css`
                        &:hover {
                          color: #209cee;
                        }
                      `,
                      'nes-pointer',
                    )}>
                    +
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
