import { useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authenticationSendEmailMagicLink } from 'store/services/auth/authenticationSendEmailMagicLink'
// import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
// import { getCountryId, getLanguageId } from 'helpers/country'
import { useSearchParams, usePathname } from 'next/navigation'
import { getCookie, handleUserCookiesConfig, setCookie } from 'helpers/cookies'
import { getLang } from 'helpers/country'
import { authenticationJobseekersLogin } from 'store/services/auth/jobseekersLogin'
import { authenticationJobseekersLogin as jobSeekersSocialLogin } from 'store/services/auth/jobseekersSocialLogin'
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'
import { languageContext } from 'app/components/providers/languageProvider'
import { formatTemplateString } from 'helpers/formatter'
import { routes } from 'helpers/utilities'
import { isMobile } from 'react-device-detect'
import { redirectUrlKey } from 'helpers/globalKey'

const useGetStarted = () => {
  // const routes = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState<string>('')
  const [emailTOP, setEmailTOP] = useState<number>()
  const [emailTOPError, setEmailTOPError] = useState(false)
  const [userId, setUserId] = useState(null)
  const [emailOTPInputDisabled, setEmailOTPInputDisabled] = useState(false)
  const [defaultRedirectPage, setDefaultRedirectPage] = useState<string>(null)
  const redirectPage = sessionStorage.getItem('redirectPage')
  const langKey = getLang()
  // const error = useSelector((store: any) => store.auth.jobseekersLogin.error)
  const [error, setError] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const redirect = searchParams.get(redirectUrlKey)
  const config = useSelector((store: any) => store.config.config.response ?? [])
  const smsCountryList = getSmsCountryList(config)
  const { getStatred } = useContext(languageContext) as any
  useEffect(() => {
    if (Array.isArray(redirect)) {
      setDefaultRedirectPage(redirect[0])
    } else {
      setDefaultRedirectPage(redirect)
    }
  }, [redirect])

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
  // const [loading, startTransition] = useTransition()
  const handleAuthenticationJobseekersLogin = (code, referral_code, invited_source) => {
    setEmailOTPInputDisabled(true)
    const uuid = localStorage.getItem('uuid')
    const data = {
      email,
      otp: code,
      source: isMobile ? 'mobile_web' : 'web',
      userId,
      browser_serial_number: uuid,
      referral_code,
      invited_source
    }
    if (!uuid) {
      delete data.browser_serial_number
    }
    // dispatch(jobbseekersLoginRequest(data))
    loginRequest(data)
    // startTransition(() => {
    //   dispatch(jobbseekersLoginRequest(data))
    // })
  }

  const handleAuthenticationJobseekersLoginPhone = (code, phone_num, referral_code, invited_source) => {
    const uuid = localStorage.getItem('uuid')
    setEmailOTPInputDisabled(true)
    const data = {
      phone_num,
      otp: code,
      source: isMobile ? 'mobile_web' : 'web',
      userId,
      browser_serial_number: uuid,
      mobile_country_id: smsCountryList.filter((country) => phone_num.includes(country.value))?.[0]
        ?.id,
      referral_code,
      invited_source
    }
    // dispatch(jobbseekersLoginRequest(data))
    loginRequest(data)
    // startTransition(() => {
    //   dispatch(jobbseekersLoginRequest(data))
    // })
  }
  const setCookiesWithLoginData = (loginData, changeToken = true) => {
    try {
      const { refresh_token, token, token_expired_at } = loginData
      const userCookie = handleUserCookiesConfig(loginData)
      if (changeToken) {
        setCookie('refreshToken', refresh_token)
        setCookie('accessToken', token, token_expired_at)
      }
      setCookie('user', userCookie)
    } catch (error) {
      console.log('error', error)
    }
  }
  const sendEventWithLoginData = (loginData) => {
    // Send register event (First time login user)
    if (
      // process.env.ENV === 'production' &&
      loginData.is_new_account &&
      typeof window !== 'undefined'
    ) {
      // Facebook Pixel
      const window = globalThis as any
      if (window.fbq) {
        window.fbq.event('sign_up', {
          user_id: loginData?.id
        })
      }

      // Google analytic Event
      if (window.gtag) {
        window.gtag('event', 'sign_up', {
          user_id: loginData?.id,
          email: loginData?.email
        })
      }

      // Tiktok Pixel
      if (window.ttq) {
        window.ttq.track('CompleteRegistration', {
          user_id: loginData?.id,
          email: loginData?.email
        })
      }
    }
  }
  const loginRequest = (data) => {
    authenticationJobseekersLogin(data)
      .then((res) => {
        if (res.data) {
          setUserInfo(res.data)
          setCookiesWithLoginData(res.data.data)
          sendEventWithLoginData(res.data.data)
        }
      })
      .catch((err) => {
        setError(err?.response)
      })
  }

  // const removeServiceCache = async () => {
  //   const token = getCookie('accessToken')
  //   const countryId = getCountryId()
  //   const languageId = getLanguageId()

  //   if (token) {
  //     await fetchUserSetting({ country_id: countryId, language_id: languageId }, token)
  //       .then((response) => console.log(response))
  //       .catch(({ response, request }) => console.log(response, request))
  //   }
  // }

  const defaultLoginCallBack = async (data: any, isPhone = false) => {
    // await removeServiceCache()
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    const newData = data || getCookie('user')
    if (newData.is_profile_update_required || !newData.is_profile_completed) {
      if (isPhone) {
        sessionStorage.setItem('fromPhoneLogin', '1')
      } else {
        sessionStorage.removeItem('fromPhoneLogin')
      }

      routes(`/${langKey}/jobseeker-complete-profile`)
    } else if (isChatRedirect) {
      localStorage.removeItem('isChatRedirect')
      location.href = isChatRedirect
      // routes.push(isChatRedirect)
    } else if (defaultRedirectPage) {
      routes(defaultRedirectPage)
    } else if (redirectPage) {
      sessionStorage.removeItem('redirectPage')
      const url = window?.location?.pathname
      if (url === redirectPage) {
        return window.location.reload()
      }
      routes(redirectPage)
    } else {
      if (pathname.indexOf('/get-started') > -1) {
        routes('/')
      } else {
        window.location.reload()
      }
    }
    setEmailOTPInputDisabled(false)
  }

  const loginFailed = () => {
    setEmailTOPError(true)
    setEmailOTPInputDisabled(false)
  }

  const handleAuthenticationSocialLogin = async (params) => {
    return jobSeekersSocialLogin(params)
      .then((result) => {
        if (result.status >= 200 && result.status < 300) {
          setUserInfo(result.data)
          setCookiesWithLoginData(result.data.data)
          sendEventWithLoginData(result.data.data)
          return Promise.resolve(result.data)
        }
      })
      .catch((error) => {
        setError(error?.response)
        return Promise.reject(error)
      })
  }

  const handleAuthenticationSendEmailMagicLink = () => {
    let params: any = {}
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (isChatRedirect && userId) {
      params.redirect = isChatRedirect
      params.redirect_fail = pathname
      localStorage.removeItem('isChatRedirect')
    } else if (pathname === '/quick-upload-resume') {
      params = {
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile'
      }
    } else if (pathname === '/resumetemplate') {
      params = {
        redirect: userId ? '/manage-profile?tab=resume' : '/jobseeker-complete-profile'
      }
    } else if (pathname === '/job/[keyword]') {
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
    params = { email, source: isMobile ? 'mobile_web' : 'web', ...params }
    authenticationSendEmailMagicLink(params)
      .then(({ data }) => {
        dispatch(
          displayNotification({
            open: true,
            message: formatTemplateString(getStatred?.magicLink?.haveSendEmail, email),
            severity: 'success'
          })
        )
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
    setStep,
    email,
    setEmail,
    setUserId,
    defaultLoginCallBack,
    userId,
    emailTOP,
    setEmailTOP,
    emailOTPInputDisabled,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationJobseekersLoginPhone,
    handleAuthenticationSendEmailMagicLink,
    handleAuthenticationSocialLogin,
    emailTOPError,
    userInfo,
    error,
    setCookiesWithLoginData,
    sendEventWithLoginData
  }
}

export default useGetStarted
