import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// api
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { authenticationSendEmailMagicLink } from 'store/services/auth/authenticationSendEmailMagicLink'
import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

import { getCountryId, getLanguageId } from 'helpers/country'
import { useRouter, useSearchParams } from 'next/navigation'
// import router, { useRouter } from 'next/router'
import { getCookie } from 'helpers/cookies'

const useGetStarted = () => {
  const routes = useRouter()
  const dispatch = useDispatch()

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
  const searchParams = useSearchParams()
  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (Array.isArray(redirect)) {
      setDefaultRedirectPage(redirect[0])
    } else {
      setDefaultRedirectPage(redirect)
    }
  }, [routes])

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
        const data = error.response?.data
        const errorMessage = data.data?.detail ? data.data?.detail : data.errors.email[0]
        dispatch(
          displayNotification({
            open: true,
            message: error.message ?? errorMessage,
            severity: 'error'
          })
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleAuthenticationJobseekersLogin = () => {
    const query: any = {}
    searchParams.forEach((value, key) => {
      query[key] = value
    })
    setEmailOTPInputDisabled(true)
    const data = {
      email,
      otp: emailTOP,
      source: 'web',
      ...query,
      userId
    }
    dispatch(jobbseekersLoginRequest(data))
  }

  const removeServiceCache = async () => {
    const token = getCookie('accessToken')
    const countryId = getCountryId()
    const languageId = getLanguageId()

    if (token) {
      await fetchUserSetting({ country_id: countryId, language_id: languageId }, token)
        .then((response) => console.log(response))
        .catch(({ response, request }) => console.log(response, request))
    }
  }

  const defaultLoginCallBack = async (data: any) => {
    await removeServiceCache()

    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (data.is_profile_update_required || !data.is_profile_completed) {
      routes.push('/jobseeker-complete-profile')
    } else if (isChatRedirect) {
      localStorage.removeItem('isChatRedirect')
      routes.push(isChatRedirect)
    } else if (defaultRedirectPage) {
      routes.push(defaultRedirectPage)
    } else {
      routes.push('/')
    }
    // let url =
    //   data.is_profile_update_required || !data.is_profile_completed
    //     ? '/jobseeker-complete-profile/1'
    //     : defaultRedirectPage
    //     ? defaultRedirectPage
    //     : '/'

    // const isChatRedirect = localStorage.getItem('isChatRedirect')
    // if (isChatRedirect) {
    //   url = isChatRedirect
    //   localStorage.removeItem('isChatRedirect')
    // }
    // routes.push(url)
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
    const pathname = location.pathname
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (isChatRedirect && userId) {
      params.redirect = isChatRedirect
      params.redirect_fail = pathname
      localStorage.removeItem('isChatRedirect')
    } else if (pathname?.includes('/quick-upload-resume')) {
      params = {
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile',
        redirect_fail: pathname
      }
    } else if (pathname?.includes('/resumetemplate')) {
      params = {
        redirect: userId ? '/manage-profile?tab=resume' : '/jobseeker-complete-profile',
        redirect_fail: pathname
      }
    } else if (pathname?.includes('/job/[keyword]')) {
      params = {
        redirect: userId ? pathname : '/jobseeker-complete-profile',
        redirect_fail: '/get-started'
      }
    } else {
      params = {
        email,
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile',
        redirect_fail: '/get-started'
      }
    }
    params = { email, source: 'web', ...params }
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
            message: error.message ?? data?.detail,
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
