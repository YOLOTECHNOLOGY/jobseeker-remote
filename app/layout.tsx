'use client'
import styles from './index.module.scss'
import Providers from './providers'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>
        <Providers>
          <div className={styles.layoutHeader}></div>
          {children}
        </Providers>
      </body>
    </html>
  )
}
// import App from '../pages/_app'

// export default App