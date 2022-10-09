import React, { useState, useEffect } from 'react'

/* Vendors */
import classNamesCombined from 'classnames/bind'
import { useUserAgent } from 'next-useragent'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import ModalAppRedirect from 'components/ModalAppRedirect'

/* Helpers */
import { getCookie, setCookieWithExpiry } from 'helpers/cookies'

/* Styles */
import styles from './AuthLayout.module.scss'

/* Images */
import { BossjobLogo } from 'images'
import MetaText from '../MetaText'

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
  headingText?: string | React.ReactNode
  isBackToLogin?: boolean
  ctaSignup?: boolean
  isLogin?: boolean
  isEmployer?: boolean
}

const AuthLayout = ({
  children,
  className,
  headingText,
  isBackToLogin,
  ctaSignup,
  isLogin
}: AuthLayoutProps) => {
  const [isShowAppRedirectModal, setIsShowAppRedirectModal] = useState(false)

  useEffect(() => {
    const userAgent = useUserAgent(window.navigator.userAgent)
    if (userAgent.isMobile && !getCookie('isAppRedirectModalClosed')) {
      setIsShowAppRedirectModal(true)
    }
  }, [])

  const handleAppRedirectModal = () => {
    setIsShowAppRedirectModal(false)
    setCookieWithExpiry('isAppRedirectModalClosed', true, 1800) // cookie expires to renable auto show modal after 30 minutes
  }

  const displayCTA = () => {
    if (ctaSignup) {
      return (
        <>
          {isBackToLogin && (
            <Text tagName='p' textStyle='base'>
              <Link to={'/get-started'} className={styles.AuthCTALink}>
                <Text textColor='primaryBlue' underline>
                  {' '}
                  Back to Get started
                </Text>
              </Link>
            </Text>
          )}
          {isLogin && (
            <>
              <Text tagName='p' textStyle='base'>
                New to Bossjob?
                <Link to='/register/jobseeker' className={styles.AuthCTALink}>
                  <Text textColor='primaryBlue' underline>
                    {' '}
                    Sign up now
                  </Text>
                </Link>
              </Text>
              <MetaText tagName='h2'>New to Bossjob? Sign up now!</MetaText>
            </>
          )}
          {!isLogin && (
            <>
              <Text tagName='p' textStyle='base'>
                Already on Bossjob?
                <Link to='/get-started' className={styles.AuthCTALink}>
                  <Text textColor='primaryBlue' underline>
                    {' '}
                    Get started
                  </Text>
                </Link>
              </Text>
              <MetaText>Already on Bossjob? Log in</MetaText>
            </>
          )}
          <Text tagName='p' textStyle='base'>
            Looking to hire people? Sign up as
            <Link to={process.env.BOSSHUNT_URL} className={styles.AuthCTALink} aTag>
              <Text textColor='primaryBlue'> Employer</Text>
            </Link>
          </Text>
        </>
      )
    }
    return ''
  }

  return (
    <div className={classNamesCombined([className, styles.AuthLayout])}>
      <div className={styles.AuthLayoutHeader}>
        <Link title='Home' to={'/'}>
          <img id={styles.logo} src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
        </Link>
      </div>
      <div className={styles.AuthLayoutBody}>
        <div className={styles.AuthWrapper}>
          <div className={styles.AuthHeading}>{headingText}</div>
          {children}
        </div>
        <div className={styles.AuthCTA}>{displayCTA()}</div>
      </div>

      <ModalAppRedirect isShowModal={isShowAppRedirectModal} handleModal={handleAppRedirectModal} />
    </div>
  )
}

export default AuthLayout
