import React from 'react'

/* Vendors */
import classNamesCombined from 'classnames/bind'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'

/* Styles */
import styles from './AuthLayout.module.scss'

/* Images */
import { BossjobLogo } from 'images'

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
  headingText?: string
  isBackToLogin?: boolean
  ctaSignup?: boolean,
  isLogin?: boolean,
  isEmployer?: boolean
}

const AuthLayout = ({
  children,
  className,
  headingText,
  isBackToLogin,
  ctaSignup,
  isLogin,
  isEmployer
}: AuthLayoutProps) => {

  const displayCTA = () => {
    if (ctaSignup) {
      return (
        <>
          {isBackToLogin && (
            <Text tagName='p' textStyle='base'>
              <Link to={'/login'} className={styles.AuthCTALink}>
                <Text textColor='primaryBlue' underline>{' '}Back to Login</Text>
              </Link> 
            </Text>
          )}
          {isLogin && (
            <Text tagName='p' textStyle='base'>
              New to Bossjob? 
              <Link to='/register' className={styles.AuthCTALink}>
                <Text textColor='primaryBlue' underline>{' '}Sign up now</Text>
              </Link>  
            </Text>
          )}
          {!isLogin && (
            <Text tagName='p' textStyle='base'>
              Already on Bossjob?
              <Link to='/login' className={styles.AuthCTALink}>
                <Text textColor='primaryBlue' underline>{' '}Log in</Text>
              </Link>  
            </Text>
          )}
          {!isEmployer && (
            <Text tagName='p' textStyle='base'>
              Looking to hire people? Sign up as
              <Link to='/register/employer' className={styles.AuthCTALink}>
                <Text textColor='primaryBlue'>{' '} Employer</Text>
              </Link>  
            </Text>
          )}
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
          <Text 
            bold
            textStyle='xxxl' 
            tagName='h2' 
            className={styles.AuthHeading}
          >
            {headingText}
          </Text>

          {children}
        </div>
        <div className={styles.AuthCTA}>
          {displayCTA()}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
