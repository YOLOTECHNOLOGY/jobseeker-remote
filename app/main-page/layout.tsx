import styles from './index.module.scss'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div >
      <div className={styles.title}>Find Job. Talk to Boss.</div>
      {children}
    </div>


  )
}
