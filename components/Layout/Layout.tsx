import React from 'react'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={className}>
      <Header />
      <HamburgerMenu />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
