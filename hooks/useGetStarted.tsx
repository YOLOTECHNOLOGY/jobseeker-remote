import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'helpers/useWindowDimensions'

// api
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { authenticationSendEmailMagicLink } from 'store/services/auth/authenticationSendEmailMagicLink'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

import router, { useRouter } from 'next/router'

const useGetStarted = () => {
  const routes = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()

  const [step, setStep] = useState(1)
  const [email, setEmaile] = useState<string>('')
  const [emailTOP, setEmailTOP] = useState<number>()
  const [emailTOPError, setEmailTOPError] = useState(false)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailOTPInputDisabled, setEmailOTPInputDisabled] = useState(false)
  const [defaultRedirectPage, setDefaultRedirectPage] = useState<string>(null)

  // const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const error = useSelector((store: any) => store.auth.jobseekersLogin.error)

  useEffect(() => {
    const redirect = routes.query.redirect
    if (Array.isArray(redirect)) {
      setDefaultRedirectPage(redirect[0])
    } else {
      setDefaultRedirectPage(redirect)
    }
  }, [])

  // useEffect(() => {
  //   if (!Object.keys(userInfo).length) {
  //     return
  //   }
  //   const { data } = userInfo
  //   logSuccess(data)
  // }, [userInfo])

  useEffect(() => {
    if (error === null) {
      return
    }
    loginFailed()
  }, [error])

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
            severity: 'error'
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
      ...router.query,
      userId
    }
    dispatch(jobbseekersLoginRequest(data))
  }

  const defaultLoginCallBack = (data: any) => {
    let url = data.is_profile_update_required || !data.is_profile_completed
      ? '/jobseeker-complete-profile/1'
      : defaultRedirectPage
        ? defaultRedirectPage
        : `/jobs-hiring/job-search`
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (isChatRedirect) {
      url = isChatRedirect
      localStorage.removeItem('isChatRedirect')
    }
    console.log('defaultLoginCallBack', url)
    routes.push(url)
    setEmailOTPInputDisabled(false)
  }

  const loginFailed = () => {
    // if (errorMessage) {
    //   dispatch(
    //     displayNotification({
    //       open: true,
    //       message: errorMessage,
    //       severity: 'warning'
    //     })
    //   )
    // }
    setEmailTOPError(true)
    setEmailOTPInputDisabled(false)
  }

  const handleAuthenticationSendEmailMagicLink = () => {
    let params: any = {}
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    console.log({userId})
    if (isChatRedirect && userId) {
      params.redirect = isChatRedirect
      params.redirect_fail = router.asPath
      localStorage.removeItem('isChatRedirect')
    } else if (router.pathname === '/quick-upload-resume') {
      params = {
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile/1',
        redirect_fail: router.asPath
      }
    } else if (router.pathname === '/resumetemplate') {
      params = {
        redirect: userId ? '/manage-profile?tab=resume' : '/jobseeker-complete-profile/1',
        redirect_fail: router.asPath
      }
    } else if (router.pathname === '/job/[keyword]') {
      params = {
        redirect: userId ? router.asPath : '/jobseeker-complete-profile/1',
        redirect_fail: '/get-started'
      }
    } else {
      params = {
        email,
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile/1',
        redirect_fail: '/get-started'
      }
    }
    params = { email, source: width > 576 ? 'web' : 'mobile_web', ...params }
    authenticationSendEmailMagicLink(params)
      .then(({ data }) => {
        if (data.data) {
          setStep(3)
        }
      })
      .catch((error) => {
        const { data } = error.response?.data
        dispatch(
          displayNotification({
            open: true,
            message: data?.detail,
            severity: 'error'
          })
        )
      })
  }

  return {
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
  }
}

export default useGetStarted
