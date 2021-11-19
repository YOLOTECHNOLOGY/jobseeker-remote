import React from 'react'
import { AppProps } from 'next/app'
import { wrapper } from 'store'
import { CookiesProvider } from 'react-cookie'
import 'styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => (
  <CookiesProvider>
    <Component {...pageProps} />
  </CookiesProvider>
)

export default wrapper.withRedux(App)
