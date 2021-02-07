/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import type { AppProps } from 'next/app'
import 'normalize.css'

import './global.css'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('@welldone-software/why-did-you-render').then(
    ({ default: whyDidYouRender }) => {
      whyDidYouRender(React, { trackAllPureComponents: true })
    },
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
