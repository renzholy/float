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
          color: var(--color-gray-0);
          border: 0.25em solid var(--color-gray-0);
          padding: 2em 2em 1.5em 2em;
        `,
        props.className,
      )}>
      {props.title ? (
        <span
          className={css`
            margin-top: -2.75em;
            margin-bottom: 0.5em;
            padding: 0.5em;
            background-color: var(--color-gray-4);
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
