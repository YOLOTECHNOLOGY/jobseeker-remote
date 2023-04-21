import Footer from 'components/Footer'
import './page.module.scss'
import 'components/Header/Header.module.scss'
import 'app/globals.scss'
// import 'app/globals.scss'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section>{children}</section>
      <Footer />
    </>
  )
}
