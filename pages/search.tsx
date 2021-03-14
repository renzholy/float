/* eslint-disable jsx-a11y/label-has-associated-control */

import { css, cx } from '@linaria/core'
import { useState } from 'react'

export default function Search() {
  const [keyword, setKeyword] = useState('')

  return (
    <div
      className={cx(
        css`
          display: flex;
          font-size: 24px;
          padding: 16px;
        `,
        'nes-field',
      )}>
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
            margin-left: 8px;
            flex-shrink: 0;
          `,
        )}>
        搜索
      </button>
    </div>
  )
}
