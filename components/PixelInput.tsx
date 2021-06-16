/* eslint-disable jsx-a11y/no-autofocus */

import { css, cx } from '@emotion/css'
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
          color: var(--color-gray-0);
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
            color: var(--color-gray-2);
          }
        `,
        props.isError
          ? css`
              border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAUSURBVHgBY2AAgud5of8ZkBkYAgDPRwqlfIp/NgAAAABJRU5ErkJggg==)
                1 / 0.25em;
              @media not all and (min-resolution: 0.001dpcm) {
                @supports (-webkit-appearance: none) {
                  border-image: url("data:image/svg+xml,%3csvg width='3' height='3' viewBox='0 0 3 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M1 0H2V1H1V0Z' fill='%23E76E55'/%3e %3cpath d='M1 2H2V3H1V2Z' fill='%23E76E55'/%3e %3cpath d='M2 1H3V2H2V1Z' fill='%23E76E55'/%3e %3cpath d='M0 1H1V2H0V1Z' fill='%23E76E55'/%3e %3c/svg%3e")
                    1 / 0.25em;
                }
              }
            `
          : css`
              border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAUSURBVHgBY2AAAkVVzf8MyAwMAQBqbwW5b8ntjAAAAABJRU5ErkJggg==)
                1 / 0.25em;
              @media not all and (min-resolution: 0.001dpcm) {
                @supports (-webkit-appearance: none) {
                  border-image: url("data:image/svg+xml,%3csvg width='3' height='3' viewBox='0 0 3 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M1 0H2V1H1V0Z' fill='%23212529'/%3e %3cpath d='M1 2H2V3H1V2Z' fill='%23212529'/%3e %3cpath d='M2 1H3V2H2V1Z' fill='%23212529'/%3e %3cpath d='M0 1H1V2H0V1Z' fill='%23212529'/%3e %3c/svg%3e")
                    1 / 0.25em;
                }
              }
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
