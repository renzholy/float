/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
// import whyDidYouRender from '@welldone-software/why-did-you-render'

import './global.css'

// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   whyDidYouRender(React, { trackAllPureComponents: true })
// }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Float - 浮动收益</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
