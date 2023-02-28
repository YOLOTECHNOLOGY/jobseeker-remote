import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

/* Styles */
import styles from './Layout.module.scss'
import classNamesCombined from 'classnames'
import { getCookie, setCookie, setCookieWithExpiry } from '../../helpers/cookies'
const Link = dynamic(() => import('@mui/material/Link'))
const MaterialAlert = dynamic(() => import('../MaterialAlert/MaterialAlert'))
const ModalVerifyEmail = dynamic(() => import('../ModalVerifyEmail'))
import Text from '../Text'

/* Helpers */
import { fetchUserOwnDetailService } from '../../store/services/users/fetchUserOwnDetail'
import ModalAppRedirect from 'components/ModalAppRedirect'
import { useUserAgent } from 'next-useragent'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  isHiddenFooter?: boolean
  isHiddenHeader?: boolean
}

const Layout = ({ children, className, isHiddenFooter, isHiddenHeader }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const userAgent = useUserAgent(window.navigator.userAgent)
  const [isShowAppRedirectModal, setIsShowAppRedirectModal] = useState(userAgent.isMobile && !getCookie('isAppRedirectModalClosed'))

  const authCookie = getCookie('accessToken')
  const userCookie = getCookie('user')

  useEffect(() => {
    setIsAuthenticated(authCookie ? true : false)
    setIsEmailVerified(userCookie?.is_email_verify)

    if (userCookie && authCookie) {
      setIsShowModal(false)
    }
    // if (userAgent.isMobile && !getCookie('isAppRedirectModalClosed')) {
    //   setIsShowAppRedirectModal(true)
    // }
  }, [])

  const handleVerifyEmailClick = async () => {
    // revalidate verify email status
    const response = await fetchUserOwnDetailService({ accessToken: authCookie })
    const userDetails = response?.data?.data
    const isVerifiedEmail = userDetails?.is_email_verify
    if (!isVerifiedEmail) {
      // email is not verified
      setIsShowModal(true)
    } else {
      // email is verified and userDetails cookie is outdated
      const userCookie = {
        active_key: userDetails.active_key,
        id: userDetails.id,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
        phone_num: userDetails.phone_num,
        is_mobile_verified: userDetails.is_mobile_verified,
        avatar: userDetails.avatar,
        additional_info: userDetails.additional_info,
        is_email_verify: true,
        notice_period_id: userDetails.notice_period_id,
        is_profile_completed: userDetails.is_profile_completed
      }
      setCookie('user', userCookie)
      setIsEmailVerified(true)
    }
  }

  const handleVerifyEmailModal = () => {
    setIsShowModal(false)
    setIsEmailVerified(getCookie('user').is_email_verify)
  }

  const handleAppRedirectModal = () => {
    setIsShowAppRedirectModal(false)
    setCookieWithExpiry('isAppRedirectModalClosed', true, 1800) // cookie expires to renable auto show modal after 30 minutes

    // Enables scrolling again
    document.documentElement.classList.remove('modal-active')
  }

  return (
    <div className={classNamesCombined([styles.container, className])}>
      {isAuthenticated && !isEmailVerified && (
        <MaterialAlert open={true} severity='info'>
          <Text>
            Please verify your email address.{' '}
            <Link onClick={handleVerifyEmailClick} sx={{ cursor: 'pointer' }}>
              Verify now.
            </Link>
          </Text>
        </MaterialAlert>
      )}
      {!isHiddenHeader && (
        <>
          <Header />
          <HamburgerMenu />
        </>
      )}
      {children}
      {!isHiddenFooter && <Footer />}

      <ModalVerifyEmail
        email={isAuthenticated && userCookie ? userCookie.email : ''}
        isShowModal={isShowModal}
        handleModal={handleVerifyEmailModal}
      />
      <ModalAppRedirect isShowModal={isShowAppRedirectModal} handleModal={handleAppRedirectModal} />
    </div>
  )
}

export default React.memo(Layout)
