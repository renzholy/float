/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import type { AppProps } from 'next/app'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import './global.css'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, { trackAllPureComponents: true })
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
