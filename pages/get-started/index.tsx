import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import Layout from 'components/Layout'
// import SEO from 'components/SEO'
import CheckEmail from 'components/GetStarted/CheckEmail/CheckEmail'
import SendTOP from 'components/GetStarted/SendTOP/SendTOP'
import MagicLink from 'components/GetStarted/MagicLink/MagicLink'
import Text from 'components/Text'
import Link from 'components/Link'

import { useFirstRender } from 'helpers/useFirstRender'
import useGetStarted from 'hooks/useGetStarted'
import { removeItem } from 'helpers/localStorage'
import { getCookie, removeCookie } from 'helpers/cookies'

import { jobseekerTokenValidate } from 'store/services/auth/jobseekersTokenValidate'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'

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
  const dispatch = useDispatch()
  const router = useRouter()
  const firstRender = useFirstRender()
  const accessToken = getCookie('accessToken')

  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)

  useEffect(() => {
    const { setp, email } = router.query
    if (setp && email) {
      if (!Array.isArray(setp)) {
        setStep(Number(setp))
      } else {
        setStep(Number(setp[0]))
      }

      if (!Array.isArray(email)) {
        setEmaile(email)
      } else {
        setEmaile(email[0])
      }
    }
  }, [router.query])

  useEffect(() => {
    if (accessToken) {
      jobseekerTokenValidate(accessToken)
        .then(() => {
          const { redirect } = router?.query
          if (redirect) {
            let redirectUrl: string
            if (Array.isArray(redirect)) {
              redirectUrl = redirect[0]
            } else {
              redirectUrl = redirect
            }
            router.push(redirectUrl)
          } else {
            router.push('/')
          }
        })
        .catch(({ response: { data, status } }) => {
          if (status == 400 || data?.errors?.error[0] === 'Invalid token') {
            removeCookie('accessToken')
            window.location.reload()
          }
        })
    }
  }, [router])

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

  useEffect(() => {
    const paramsList = getParams()
    if (paramsList?.type == 'LoginOut') {
      dispatch(
        displayNotification({
          open: true,
          message: 'Login TimeOut',
          severity: 'warning'
        })
      )
    }
  }, [])

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  const getParams = () => {
    const url = location.search
    const theRequest: { [key: string]: string } = {}
    if (url.indexOf('?') != -1) {
      const str = url.substr(1)
      const strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
    }
    return theRequest
  }

  return (
    <Layout isHiddenFooter>
      {/* <SEO
        title='Get started | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/get-started'
      /> */}
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
                  to={
                    process.env.ENV === 'development'
                      ? 'https://dev.hunt.bossjob.ph'
                      : 'https://hunt.bossjob.ph'
                  }
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

export const getServerSideProps = () => {
  return {
    props: {
      seoMetaTitle: 'Get started | Bossjob',
      seoMetaDescription:
        'Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.',
      canonicalUrl: '/get-started'
    }
  }
}
export default GetStarted
