import { css, cx } from '@linaria/core'

export default function PixelButton(props: {
  className?: string
  intent?: 'success'
  disabled?: boolean
  onClick?(): void
  children: string
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
          border-image: url('/border.svg') 1 / 0.25em;
          border-width: 0.25em;
          padding: 0.75em;
          background-clip: padding-box;

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
            box-shadow: inset -0.25em -0.25em #4aa52e;
            &:hover {
              background-color: #76c442;
            }
            &:active {
              box-shadow: inset 0.25em 0.25em #4aa52e;
            }
          `,
        }[props.intent!] ||
          css`
            color: #212529;
            background-color: #ffffff;
            box-shadow: inset -0.25em -0.25em #adafbc;
            &:hover {
              background-color: #e7e7e7;
            }
            &:active {
              box-shadow: inset 0.25em 0.25em #adafbc;
            }
          `,
        props.className,
      )}
      onClick={props.onClick}>
      {props.children}
    </button>
  )
}
