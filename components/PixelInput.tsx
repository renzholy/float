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
        'nes-text',
        css`
          color: #212529;
          font-size: 1em;
          appearance: none;
          padding: 0.75em;
          outline: none;
          width: 100%;
          text-indent: 1px;
          user-select: text;
          margin: 0;
          border-width: 0.25em;
          &::placeholder {
            color: #d3d3d3;
          }
        `,
        props.isError
          ? css`
              border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAUSURBVHgBY2AAgud5of8ZkBkYAgDPRwqlfIp/NgAAAABJRU5ErkJggg==)
                1 / 0.25em space;
            `
          : css`
              border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAUSURBVHgBY2AAAkVVzf8MyAwMAQBqbwW5b8ntjAAAAABJRU5ErkJggg==)
                1 / 0.25em space;
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
