import { cx, css } from '@linaria/core'
import { useAtom } from 'jotai'
import { ReactNode } from 'react'

import { hidePriceAtom } from '../libs/atoms'

export default function Calculation(props: {
  className?: string
  children: ReactNode
}) {
  const [hidePrice] = useAtom(hidePriceAtom)

  return (
    <span
      className={cx(
        css`
          color: #d3d3d3;
        `,
        props.className,
      )}>
      {hidePrice ? null : props.children}
    </span>
  )
}
