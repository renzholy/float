import { css, cx } from '@linaria/core'
import { ReactNode } from 'react'

export default function PixelContainer(props: {
  className?: string
  title?: string
  children: ReactNode
}) {
  return (
    <div
      className={cx(
        css`
          border: 0.25em solid #212529;
          padding: 2em;
        `,
        props.className,
      )}>
      {props.title ? (
        <span
          className={css`
            margin-top: -2.25em;
            margin-bottom: 1em;
            padding: 0 0.5em;
            background-color: white;
            display: block;
            width: fit-content;
          `}>
          {props.title}
        </span>
      ) : null}
      {props.children}
    </div>
  )
}
