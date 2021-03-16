/* eslint-disable jsx-a11y/control-has-associated-label */

import { css, cx } from '@linaria/core'

export default function PixelButton(props: {
  className?: string
  intent?: 'success'
  disabled?: boolean
  onClick?(): void
  icon: string
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      className={cx(
        'nes-pointer',
        css`
          font-size: 1em;
          outline: none !important;
          appearance: none;
          border-image: url('/icons/border.svg') 1 / 0.25em;
          border-width: 0.25em;
          padding: 0.25em;
          background-clip: padding-box;
          line-height: 0;
          background-size: 2em;
          background-position: 50%;
          background-repeat: no-repeat;
          width: 3em;
          height: 3em;

          &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
            color: #212529 !important;
            background-color: #d3d3d3 !important;
            border-image: url('/border-disabled.svg') 1 / 0.25em;
            box-shadow: inset -0.25em -0.25em #adafbc !important;
          }
        `,
        {
          success: css`
            color: #fff;
            background-color: #92cc41;
            &:hover {
              background-color: #76c442;
            }
            &:active {
              background-color: #4aa52e;
            }
          `,
        }[props.intent!] ||
          css`
            color: #212529;
            background-color: #ffffff;
            &:hover {
              background-color: #e7e7e7;
            }
            &:active {
              background-color: #adafbc;
            }
          `,
        props.className,
      )}
      onClick={props.onClick}
      style={{ backgroundImage: `url(/icons/${props.icon}.svg)` }}
    />
  )
}
