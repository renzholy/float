/* eslint-disable jsx-a11y/control-has-associated-label */

import { css, cx } from '@linaria/core'
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
          outline: none !important;
          appearance: none;
          border-width: 0.25em;
          padding: 0.25em;
          background-clip: padding-box;
          line-height: 0;
          background-size: 2em;
          background-position: 50%;
          background-repeat: no-repeat;
          width: 3em;
          height: 3em;
          color: #212529;
          background-color: #ffffff;
          border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAUSURBVHgBY2AAAkVVzf8MyAwMAQBqbwW5b8ntjAAAAABJRU5ErkJggg==)
            1 / 0.25em space;
          @media not all and (min-resolution: 0.001dpcm) {
            @supports (-webkit-appearance: none) {
              border-image: url("data:image/svg+xml,%3csvg width='3' height='3' viewBox='0 0 3 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M1 0H2V1H1V0Z' fill='%23212529'/%3e %3cpath d='M1 2H2V3H1V2Z' fill='%23212529'/%3e %3cpath d='M2 1H3V2H2V1Z' fill='%23212529'/%3e %3cpath d='M0 1H1V2H0V1Z' fill='%23212529'/%3e %3c/svg%3e")
                1 / 0.25em space;
            }
          }
          &:hover {
            background-color: #e7e7e7;
            box-shadow: inset -0.25em -0.25em #adafbc;
          }
          &:active {
            background-color: #e7e7e7;
            box-shadow: inset 0.25em 0.25em #adafbc;
          }
          &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
            background-color: #d3d3d3;
            box-shadow: none;
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
