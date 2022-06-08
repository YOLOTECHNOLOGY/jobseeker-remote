import React, { useEffect, useState } from 'react'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

/* Styles */
import styles from './Layout.module.scss'
import classNamesCombined from 'classnames'
import { getCookie, setCookieWithExpiry } from '../../helpers/cookies'
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

  const authCookie = getCookie('accessToken')
  const userCookie = getCookie('user')

  useEffect(() => {
    setIsAuthenticated(authCookie ? true : false)
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

  const handleVerifyEmailModal = (isShow: boolean) => {
    setIsShowModal(isShow)
    setIsEmailVerified(getCookie('user').is_email_verify)
    setCookieWithExpiry('isVerifyEmailModalClosed', true, 3600) // cookie expires to renable auto show modal after 1 hour
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
        email={isAuthenticated && userCookie ? userCookie.email : ''}
        isShowModal={isShowModal}
        handleModal={handleVerifyEmailModal}
      />
    </div>
  )
}

export default React.memo(Layout)
