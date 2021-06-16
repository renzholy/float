/* eslint-disable jsx-a11y/control-has-associated-label */

import { css, cx } from '@emotion/css'
import { ReactElement } from 'react'

import { SVG2DataURI } from '../libs/svg'

export default function PixelButton(props: {
  className?: string
  onClick?(): void
  icon: ReactElement
}) {
  return (
    <button
      type="button"
      className={cx(
        'nes-pointer',
        css`
          font-size: 1em;
          outline: none;
          appearance: none;
          border-width: 0.25em;
          background-clip: padding-box;
          line-height: 0;
          background-size: 2.5em;
          background-position: 50%;
          background-repeat: no-repeat;
          width: 3em;
          height: 3em;
          color: var(--color-gray-0);
          background-color: var(--color-gray-4);
          border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAUSURBVHgBY2AAAkVVzf8MyAwMAQBqbwW5b8ntjAAAAABJRU5ErkJggg==)
            1 / 0.25em;
          @media not all and (min-resolution: 0.001dpcm) {
            @supports (-webkit-appearance: none) {
              border-image: url("data:image/svg+xml,%3csvg width='3' height='3' viewBox='0 0 3 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M1 0H2V1H1V0Z' fill='%23212529'/%3e %3cpath d='M1 2H2V3H1V2Z' fill='%23212529'/%3e %3cpath d='M2 1H3V2H2V1Z' fill='%23212529'/%3e %3cpath d='M0 1H1V2H0V1Z' fill='%23212529'/%3e %3c/svg%3e")
                1 / 0.25em;
            }
          }
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              background-color: var(--color-gray-3);
              box-shadow: inset -0.25em -0.25em var(--color-gray-1);
            }
          }
          &:active {
            background-color: var(--color-gray-3);
            box-shadow: inset 0.25em 0.25em var(--color-gray-1);
          }
        `,
        props.className,
      )}
      onClick={props.onClick}
      style={{
        backgroundImage: SVG2DataURI(props.icon),
      }}
    />
  )
}
