import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// api
import { authenticationSendEmailMagicLink } from 'store/services/auth/authenticationSendEmailMagicLink'
import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

import { getCountryId, getLanguageId } from 'helpers/country'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { getCookie } from 'helpers/cookies'
import { getLang } from 'helpers/country'
import { removeItem } from 'helpers/localStorage'
const useGetStarted = () => {
  const routes = useRouter()
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
  const langKey = getLang()
  // console.log(useSearchParams,'router')
  // const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const error = useSelector((store: any) => store.auth.jobseekersLogin.error)

  const redirect = searchParams.get('redirect')
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

  const handleAuthenticationJobseekersLogin = (code) => {
    setEmailOTPInputDisabled(true)
    const uuid = localStorage.getItem('uuid')
    const data = {
      email,
      otp: code,
      source: 'web',
      userId,
      browser_serial_number: uuid
    }
    if (!uuid) {
      delete data.browser_serial_number
    }
    dispatch(jobbseekersLoginRequest(data))
  }

  const handleAuthenticationJobseekersLoginPhone = (code, phone_num) => {
    const uuid = localStorage.getItem('uuid')
    setEmailOTPInputDisabled(true)
    const data = {
      phone_num,
      otp: code,
      source: 'web',
      userId,
      browser_serial_number: uuid
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

  const defaultLoginCallBack = async (data: any, isPhone = false) => {
    await removeServiceCache()
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (data.is_profile_update_required || !data.is_profile_completed) {
      if (isPhone) {
        sessionStorage.setItem('fromPhoneLogin', '1')
      } else {
        sessionStorage.removeItem('fromPhoneLogin')
      }

      routes.push(`/${langKey}/jobseeker-complete-profile/1`)
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
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (isChatRedirect && userId) {
      params.redirect = isChatRedirect
      params.redirect_fail = pathname
      localStorage.removeItem('isChatRedirect')
    } else if (pathname === '/quick-upload-resume') {
      params = {
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile/1'
        // redirect_fail: router.asPath
      }
    } else if (pathname === '/resumetemplate') {
      params = {
        redirect: userId ? '/manage-profile?tab=resume' : '/jobseeker-complete-profile/1'
        // redirect_fail: router.asPath
      }
    } else if (pathname === '/job/[keyword]') {
      params = {
        redirect: userId ? pathname : '/jobseeker-complete-profile/1',
        redirect_fail: '/get-started'
      }
    } else {
      params = {
        email,
        redirect: userId ? '/jobs-hiring/job-search' : '/jobseeker-complete-profile/1',
        redirect_fail: '/get-started'
      }
    }
    params = { email, source: 'web', ...params }
    authenticationSendEmailMagicLink(params)
      .then(({ data }) => {
        console.log(data)
        dispatch(
          displayNotification({
            open: true,
            message: `We’ve sent a magic link to ${email}. Please click on the link to proceed.`,
            severity: 'success'
          })
        )
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
    emailTOPError
  }
}

export default useGetStarted
