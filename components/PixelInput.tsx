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
          padding: 12px;
          outline: none;
          width: 100%;
          text-indent: 1px;
          user-select: text;
        `,
        props.isError
          ? css`
              border-image: url('/border-error.png') 4 / 4px round;
            `
          : css`
              border-image: url('/border.png') 4 / 4px round;
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
