import { css, cx } from '@linaria/core'

import { IconBox } from '../assets/icons'
import { SVG2DataURI } from '../libs/svg'

export default function EasterEgg() {
  return (
    <div
      className={cx(
        'nes-pointer',
        css`
          width: 3em;
          height: 3em;
          line-height: 0;
          background-size: 2.5em;
          background-position: 50%;
          background-repeat: no-repeat;
          width: 3em;
          height: 3em;
        `,
      )}
      style={{
        backgroundImage: SVG2DataURI(<IconBox />),
      }}
    />
  )
}
