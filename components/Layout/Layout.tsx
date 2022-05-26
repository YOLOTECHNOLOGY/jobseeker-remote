import React, { useEffect, useState } from 'react'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

/* Styles */
import styles from './Layout.module.scss'
import classNamesCombined from 'classnames'
import { getCookie } from '../../helpers/cookies'
import { Link } from '@mui/material'
import MaterialAlert from '../MaterialAlert/MaterialAlert'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout = ({ children, className }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
    const userCookie = getCookie('user')
    setIsEmailVerified(userCookie?.is_email_verified)
  }, [])
  
  return (
    <div className={classNamesCombined([styles.container, className])}>
      {isAuthenticated && !isEmailVerified && (
        <MaterialAlert
          open={true}
          severity='info'
        >
          Please verify your email address. <Link>Verify now.</Link>
        </MaterialAlert>
      )}
      <Header />
      <HamburgerMenu />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
