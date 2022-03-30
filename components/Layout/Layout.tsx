import React from 'react'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

/* Styles */
import styles from './Layout.module.scss'
import classNamesCombined from 'classnames'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={classNamesCombined([styles.container, className])}>
      <Header />
      <HamburgerMenu />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
