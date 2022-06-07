import React, { useEffect, useState } from 'react'

/* Components */
import Header from 'components/Header'
import Footer from 'components/Footer'
import HamburgerMenu from 'components/HamburgerMenu'

/* Styles */
import styles from './Layout.module.scss'
import classNamesCombined from 'classnames'
import { getCookie, setCookie, setCookieWithExpiry } from '../../helpers/cookies'
import { Link } from '@mui/material'
import MaterialAlert from '../MaterialAlert/MaterialAlert'
import ModalVerifyEmail from '../ModalVerifyEmail'
import Text from '../Text'
import configuredAxios from '../../helpers/configuredAxios'

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

  const handleVerifyEmailClick = async () => {
    const axios = configuredAxios('jobseeker', 'protected', '', authCookie)
    const response =  await axios.get('/me')
    const isVerifiedEmail = response?.data?.data?.is_email_verify;
    if (!isVerifiedEmail) {
      setIsShowModal(true);
    } else { // user cookie is outdated
      const user = getCookie('user')
      const userCookie = {
        active_key: user.active_key,
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_num: user.phone_num,
        is_mobile_verified: user.is_mobile_verified,
        avatar: user.avatar,
        additional_info: user.additional_info,
        is_email_verify: true,
        notice_period_id: user.notice_period_id,
        is_profile_completed: user.is_profile_completed,
        recruiter_latest_work_xp:
          (user.recruiter_latest_work_xp && {
            company_id: user.recruiter_latest_work_xp.company_id,
            job_title: user.recruiter_latest_work_xp.job_title,
            is_currently_work_here: user.recruiter_latest_work_xp.is_currently_work_here,
          }) ||
          null,
      }
      setCookie('user', userCookie)
    }
  }

  const handleVerifyEmailModal = (isShow: boolean) => {
    setIsShowModal(isShow)
    setIsEmailVerified(getCookie('user').is_email_verify)
    setCookieWithExpiry('isVerifyEmailModalClosed', true, 3600) // cookie expires to renable auto show modal after 1 hour
    // once modal is closed, body should not be fixed to enable scrolling
    const scrollY = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    // retrieve previous scroll position
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
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
