import { css } from '@linaria/core'

import EasterEgg from '../components/EasterEgg'

export default function Test() {
  return (
    <div
      className={css`
        height: 600px;
        width: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
      `}>
      <EasterEgg />
    </div>
  )
}
