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
import ModalVerifyEmail from '../ModalVerifyEmail'
import Text from '../Text'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout = ({ children, className }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
    const userCookie = getCookie('user')
    setIsEmailVerified(userCookie?.is_email_verify)
  }, [])

  return (
    <div className={classNamesCombined([styles.container, className])}>
      {isAuthenticated && !isEmailVerified && (
        <MaterialAlert open={true} severity='info'>
          <Text>
            Please verify your email address.{' '}
            <Link onClick={() => setIsShowModal(true)} sx={{ cursor: 'pointer' }}>
              Verify now.
            </Link>
          </Text>
        </MaterialAlert>
      )}
      <Header />
      <HamburgerMenu />
      {children}
      <Footer />
      <ModalVerifyEmail
        email={isAuthenticated && getCookie('user') ? getCookie('user').email : ''}
        isShowModal={isShowModal}
        handleModal={(isShow: boolean) => {
          setIsShowModal(isShow)
          setIsEmailVerified(getCookie('user').is_email_verify)
        }}
      />
    </div>
  )
}

export default Layout
