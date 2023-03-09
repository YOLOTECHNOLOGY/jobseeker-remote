// 'use client'
import Providers from './components/providers'
import Header from './components/Header'
import styles from './index.module.scss'
import './globals.scss'

// import StaticProviders from './components/providers'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body id='next-app'>
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
