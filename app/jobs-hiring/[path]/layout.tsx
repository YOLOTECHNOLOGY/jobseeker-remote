// import styles from './index.module.scss'
import './index.module.scss'
import 'app/globals.scss'
import './components/jobCard/index.mobile.module.scss'
import './components/jobCard/index.module.scss'
import './components/loadMore/index.module.scss'
import './components/searchHistories/index.module.scss'
import './components/table/index.module.scss'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        {children}
      </>
  
    )
  }
  