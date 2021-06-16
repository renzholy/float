/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { injectGlobal } from '@emotion/css'

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
injectGlobal`
:root {
  --color-gray-0: #212529;
  --color-gray-1: #adafbc;
  --color-gray-2: #d3d3d3;
  --color-gray-3: #e7e7e7;
  --color-gray-4: #ffffff;

  --color-primary-0: #209cee;
  --color-primary-1: #006bb3;

  --color-success-0: #92cc41;

  --color-error-0: #e76e55;
}

::-webkit-scrollbar {
  display: none;
}

@media (prefers-color-scheme: light) {
  body {
    background-color: var(--color-gray-4);
  }
}

@font-face {
  font-family: zpix;
  src: url(/zpix.woff2) format('woff2');
}

html * {
  box-sizing: border-box;
  user-select: none;
  font-family: zpix, 'Courier New', Courier, monospace;
  font-weight: bold;
  font-smooth: never;
  -webkit-font-smoothing: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: transparent;
}

html {
  min-width: 360px;
  cursor: url(/cursors/cursor-default.svg), auto;
}

html body {
  margin: 0;
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.nes-pointer {
  cursor: url(/cursors/cursor-pointer.svg) 14 0, pointer;
}

.nes-text {
  cursor: url(/cursors/cursor-text.svg) 16 16, text;
}
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Float - 浮动收益</title>
        <meta
          name="description"
          content="随时随地查看浮动收益，支持股票、基金、外汇、加密货币。"
        />
        <meta
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover"
          name="viewport"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
