import Footer from 'components/Footer'
import styles from './index.module.scss'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className={styles.containerWrapper}>{children}</section>
      <Footer />
    </>
  )
}
