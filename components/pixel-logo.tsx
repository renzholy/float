import { css, cx } from '@emotion/css'
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
      target="_blank"
      rel="noreferrer"
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
