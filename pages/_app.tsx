/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Float - 浮动收益</title>
        <meta
          name="description"
          content="随时随地查看浮动收益，支持股票、基金、外汇、加密货币。"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
