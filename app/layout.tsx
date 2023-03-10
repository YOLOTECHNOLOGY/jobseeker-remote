// 'use client'
import Providers from './components/providers'
import Header from './components/Header'
import styles from './index.module.scss'
import './globals.scss'
import Initial from './components/Initals'
import { Metadata } from 'next'
// import StaticProviders from './components/providers'
export const metadata:Metadata = {
  
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body id='next-app'>
        <Initial />
        <Providers>
          <Header />
          <div className={styles.container}>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
// import App from '../pages/_app'

// export default App
