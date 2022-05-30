import React, { useEffect, useState } from 'react'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

/* Styles */
import styles from './Layout.module.scss'
import classNamesCombined from 'classnames'
import { setCookie, getCookie } from '../../helpers/cookies'
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
    const authCookie = getCookie('accessToken')
    setIsAuthenticated(getCookie('accessToken') ? true : false)
    const userCookie = getCookie('user')
    setIsEmailVerified(userCookie?.is_email_verify)
    const isVerifyEmailModalClosed = getCookie('isVerifyEmailModalClosed')
    setIsShowModal(!isVerifyEmailModalClosed && !!authCookie && !!!userCookie.is_email_verify)
  }, [])

  if (isShowModal) {
    // if modal is show, body should be fixed to disable scrolling
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${window.scrollY}px`
  }

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
          setCookie('isVerifyEmailModalClosed', true)
          // once modal is closed, body should not be fixed to enable scrolling
          const scrollY = document.body.style.top
          document.body.style.position = ''
          document.body.style.top = ''
          // retrieve previous scroll position
          window.scrollTo(0, parseInt(scrollY || '0') * -1)
        }}
      />
    </div>
  )
}

export default Layout
