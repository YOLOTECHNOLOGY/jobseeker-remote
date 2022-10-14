import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import Layout from 'components/Layout'
import SEO from 'components/SEO'
import CheckEmail from 'components/GetStarted/CheckEmail/CheckEmail'
import SendTOP from 'components/GetStarted/SendTOP/SendTOP'
import MagicLink from 'components/GetStarted/MagicLink/MagicLink'
import Text from 'components/Text'
import Link from 'components/Link'

import { useFirstRender } from 'helpers/useFirstRender'
import useGetStarted from 'hooks/useGetStarted'
import { removeItem } from 'helpers/localStorage'

import styles from './index.module.scss'

const COUNT_DOWN_VERIFY_DEFAULT = 60

const GetStarted = () => {
  const {
    step,
    setStep,
    email,
    setEmaile,
    setUserId,
    handleSendEmailTOP,
    isLoading,
    defaultLoginCallBack,
    userId,
    emailTOP,
    setEmailTOP,
    emailOTPInputDisabled,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    emailTOPError
  } = useGetStarted()
  const router = useRouter()
  const firstRender = useFirstRender()

  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (!Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo
    removeItem('quickUpladResume')
    defaultLoginCallBack(data)
  }, [userInfo])

  useEffect(() => {
    const { data } = jobseekersSocialResponse
    if (data?.token) {
      removeItem('quickUpladResume')
      defaultLoginCallBack(data)
    }
  }, [jobseekersSocialResponse])

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
        title='Get started | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/get-started'
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
                router={router}
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
                emailTOPError={emailTOPError}
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
