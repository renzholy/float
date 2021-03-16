/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */

import { cx, css } from '@linaria/core'
import { ReactElement } from 'react'

import { SVG2DataURI } from '../libs/svg'

export default function PixelLogo(props: {
  className?: string
  icon: ReactElement
  href: string
}) {
  return (
    <a
      href={props.href}
      target="_black"
      className={cx(
        css`
          appearance: none;
          display: inline-block;
          line-height: 0;
          background-size: 3em;
          background-repeat: no-repeat;
          height: 3em;
          width: 3em;
        `,
        props.className,
        'nes-pointer',
      )}
      style={{ backgroundImage: SVG2DataURI(props.icon) }}
    />
  )
}