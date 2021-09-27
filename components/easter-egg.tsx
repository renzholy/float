/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@emotion/css'
import { useCallback, useState } from 'react'

import { IconBox, IconCoin } from './icons'
import { SVG2DataURI } from '../libs/svg'

const DURATION = 400

function Coin() {
  return (
    <div
      className={css`
        position: absolute;
        width: 3em;
        height: 3em;
        line-height: 0;
        background-size: 2.5em;
        background-position: 50%;
        background-repeat: no-repeat;
        @keyframes bounce {
          from {
            top: 0px;
          }
          80% {
            top: -150px;
          }
          to {
            top: -70px;
          }
        }
        animation: bounce ${DURATION}ms cubic-bezier(0.3, 2.4, 0.85, 2.5);
      `}
      style={{
        backgroundImage: SVG2DataURI(<IconCoin />),
      }}
    />
  )
}

export default function EasterEgg() {
  const [coins, setCoins] = useState<{ [key: string]: boolean }>({})
  const [show, setShow] = useState(false)
  const handleClick = useCallback(() => {
    setShow(true)
    if (
      'vibrate' in window.navigator &&
      typeof window.navigator.vibrate === 'function'
    ) {
      window.navigator.vibrate([10])
    }
    const id = Math.random().toString()
    setCoins((old) => ({
      ...old,
      [id]: true,
    }))
    setTimeout(() => {
      setCoins((old) => {
        const { [id]: remove, ...rest } = old
        return rest
      })
    }, DURATION * 0.9)
  }, [])

  return (
    <div
      className={css`
        position: relative;
        width: 3em;
        height: 3em;
        line-height: 0;
      `}
    >
      {Object.keys(coins).map((key) => (
        <Coin key={key} />
      ))}
      <div
        className={cx(
          'nes-pointer',
          css`
            position: absolute;
            width: 3em;
            height: 3em;
            line-height: 0;
            background-size: 3em;
            background-position: 50%;
            background-repeat: no-repeat;
          `,
        )}
        style={{
          opacity: show ? 1 : 0,
          backgroundImage: SVG2DataURI(<IconBox />),
        }}
        onClick={handleClick}
      />
    </div>
  )
}
