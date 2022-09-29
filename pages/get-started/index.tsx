import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import CheckEmail from 'components/GetStarted/CheckEmail/CheckEmail'
import SendTOP from 'components/GetStarted/SendTOP/SendTOP'
import MagicLink from 'components/GetStarted/MagicLink/MagicLink'
import Text from 'components/Text'
import Link from 'components/Link'
import useWindowDimensions from 'helpers/useWindowDimensions'

// api
import {
  authenticationSendEmaillOtp,
  authenticationJobseekersLogin,
  authenticationSendEmailMagicLink
} from 'store/services/auth/generateEmailOtp'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import styles from './index.module.scss'
import { setCookie } from 'helpers/cookies'
import router, { useRouter } from 'next/router'
import classNames from 'classnames'

const COUNT_DOWN_VERIFY_DEFAULT = 10

const GetStarted = () => {
  const routes = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()

  const [step, setStep] = useState(1)
  const [email, setEmaile] = useState<string>('')
  const [emailTOP, setEmailTOP] = useState<number>()
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailOTPInputDisabled, setEmailOTPInputDisabled] = useState(false)

  const handleSendEmailTOP = () => {
    setIsLoading(true)
    authenticationSendEmaillOtp({ email })
      .then(({ data }) => {
        // show setp 2
        if (data.data) {
          setUserId(data.data.user_id)
          if (step !== 2) {
            setStep(2)
          }
        }
      })
      .catch((error) => {
        const { data } = error.response
        const errorMessage = data.data?.detail ? data.data?.detail : data.errors.email[0]
        dispatch(
          displayNotification({
            open: true,
            message: errorMessage,
            severity: 'warning'
          })
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleAuthenticationJobseekersLogin = () => {
    setEmailOTPInputDisabled(true)
    const data = {
      email,
      otp: emailTOP,
      source: width > 576 ? 'web' : 'mobile_web',
      ...router.query
    }
    authenticationJobseekersLogin(data)
      .then(({ data }) => {
        if (data.data.token) {
          setCookie('accessToken', data.data.token)
          if (userId) {
            routes.push('/jobs-hiring/job-search')
          } else {
            router.push('/jobseeker-complete-profile/1')
          }
        }
      })
      .catch((error) => {
        const errorMessage = error.response.data?.errors?.error[0]
        if (errorMessage) {
          dispatch(
            displayNotification({
              open: true,
              message: errorMessage,
              severity: 'warning'
            })
          )
        }
      })
      .finally(() => {
        setEmailOTPInputDisabled(false)
      })
  }

  const handleAuthenticationSendEmailMagicLink = () => {
    authenticationSendEmailMagicLink({ email })
      .then(({ data }) => {
        if (data.data) {
          setStep(3)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  return (
    <Layout isHiddenFooter>
      <SEO
        title='Sign Up | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/register/jobseeker'
      />
      <div className={classNames([styles.Container, step === 3 ? styles.ContainerMagic : ''])}>
        <div>
          <div className={styles.getStartedContainer}>
            {step == 1 && (
              <CheckEmail
                errorText={errorText}
                setStep={setStep}
                email={email}
                setEmaile={setEmaile}
                setUserId={setUserId}
                handleSendEmailTOP={handleSendEmailTOP}
                isLoading={isLoading}
              />
            )}
            {step == 2 && (
              <SendTOP
                userId={userId}
                COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
                handleSendEmailTOP={handleSendEmailTOP}
                email={email}
                emailTOP={emailTOP}
                setEmailTOP={setEmailTOP}
                isLoading={isLoading}
                emailOTPInputDisabled={emailOTPInputDisabled}
                login={handleAuthenticationJobseekersLogin}
                magicLink={handleAuthenticationSendEmailMagicLink}
              />
            )}
            {step == 3 && <MagicLink userId={userId} email={email} />}
          </div>
          <div className={styles.ToEmployer}>
            {step == 1 && (
              <Text tagName='p' textStyle='base' className={styles.ToEmployer_textColor}>
                Looking to hire people? Sign up as
                <Link
                  to={`${process.env.OLD_PROJECT_URL}/login`}
                  className={styles.AuthCTALink}
                  aTag
                  external
                >
                  <Text textColor='primaryBlue'> Employer</Text>
                </Link>
              </Text>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GetStarted
