/* eslint-disable jsx-a11y/no-autofocus */

import { css, cx } from '@linaria/core'
import { ChangeEvent, useCallback } from 'react'

export default function PixelInput(props: {
  className?: string
  placeholder?: string
  autoFocus?: boolean
  isError?: boolean
  value: string
  onChange: (value: string) => void
}) {
  const { onChange } = props
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <input
      className={cx(
        css`
          font-size: 1em;
          appearance: none;
          padding: 0.75em;
          outline: none;
          width: 100%;
          text-indent: 1px;
          user-select: text;
        `,
        props.isError
          ? css`
              border-image: url('/border-error.svg') 1 / 0.25em;
              border-width: 0.25em;
            `
          : css`
              border-image: url('/border.svg') 1 / 0.25em;
              border-width: 0.25em;
            `,
        props.className,
      )}
      placeholder={props.placeholder}
      autoFocus={props.autoFocus}
      value={props.value}
      onChange={handleChange}
    />
  )
}
