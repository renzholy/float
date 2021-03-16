/* eslint-disable jsx-a11y/no-autofocus */

import { css, cx } from '@linaria/core'
import { ChangeEvent, useCallback } from 'react'

import { IconBorder, IconBorderError } from '../assets/icons'
import { SVG2DataURI } from '../libs/svg'

export default function PixelInput(props: {
  className?: string
  placeholder?: string
  autoFocus?: boolean
  isError?: boolean
  value: string
  onChange: (value: string) => void
}) {
  const { onChange } = props
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <input
      className={cx(
        'nes-text',
        css`
          color: #212529;
          font-size: 1em;
          appearance: none;
          padding: 0.75em;
          outline: none;
          width: 100%;
          text-indent: 1px;
          user-select: text;
          margin: 0;

          &::placeholder {
            color: #d3d3d3;
          }
        `,
        props.isError
          ? css`
              border-width: 0.25em;
            `
          : css`
              border-width: 0.25em;
            `,
        props.className,
      )}
      style={{
        borderImage: `${SVG2DataURI(
          props.isError ? <IconBorderError /> : <IconBorder />,
        )} 1 / 0.25em`,
      }}
      placeholder={props.placeholder}
      autoFocus={props.autoFocus}
      value={props.value}
      onChange={handleChange}
    />
  )
}
