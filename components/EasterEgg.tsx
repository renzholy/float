/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css, cx } from '@linaria/core'
import { useCallback, useState } from 'react'

import { IconBox, IconCoin } from '../assets/icons'
import { SVG2DataURI } from '../libs/svg'

function Coin() {
  return (
    <div
      className={css`
        position: absolute;
        width: 3em;
        height: 3em;
        line-height: 0;
        background-size: 2em;
        background-position: 50%;
        background-repeat: no-repeat;
        @keyframes bounce {
          from,
          to {
            top: -50px;
          }
          80% {
            top: -100px;
          }
        }
        animation: bounce 400ms cubic-bezier(0.3, 2.4, 0.85, 2.5);
      `}
      style={{
        backgroundImage: SVG2DataURI(<IconCoin />),
      }}
    />
  )
}

export default function EasterEgg() {
  const [coins, setCoins] = useState<{ [key: string]: boolean }>({})
  const handleClick = useCallback(() => {
    window.navigator.vibrate([20])
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
    }, 400)
  }, [])

  return (
    <div
      className={css`
        position: relative;
        width: 3em;
        height: 3em;
        line-height: 0;
      `}>
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
            background-size: 2.5em;
            background-position: 50%;
            background-repeat: no-repeat;
          `,
        )}
        style={{
          backgroundImage: SVG2DataURI(<IconBox />),
        }}
        onClick={handleClick}
      />
    </div>
  )
}
