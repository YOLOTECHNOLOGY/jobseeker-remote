'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useUserAgent } from 'next-useragent'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

// tools
// import useWindowDimensions from 'helpers/useWindowDimensions'
import { setCookie, setCookieWithExpiry } from 'helpers/cookies'

// components
import ModalAppRedirect from 'components/ModalAppRedirect'

// api
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'

const Verify = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const [isShowAppRedirectModal, setIsShowAppRedirectModal] = useState(false)
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const error = useSelector((store: any) => store.auth.jobseekersLogin.error)
  const userAgent = useUserAgent(window.navigator.userAgent)

  useEffect(() => {
    if (userAgent.isMobile) {
      setCookie('isAppRedirectModalClosed', true)
      setIsShowAppRedirectModal(true)
    }
  }, [userAgent])
  const startedLoginRef = useRef(false)
  useEffect(() => {
    if (userAgent.deviceType != 'mobile' && !startedLoginRef.current) {
      startedLoginRef.current = true
      headerAuthLogin()
    }
  }, [userAgent])

  useEffect(() => {
    if (!Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo
    logSuccess(data)
  }, [userInfo])

  useEffect(() => {
    if (!error) {
      return
    }
    let errorMessage: string
    const errorKey = Object.keys(error.data?.errors)
    if (errorKey.length) {
      errorMessage = errorKey[0] + ': ' + error.data?.errors[errorKey[0]][0]
    }
    loginFailed(errorMessage)
  }, [error])

  const headerOpenApp = () => {
    const email = searchParams.get('email')
    const otp = searchParams.get('otp')
    const schema = `bossjob://bossjob.ph/verify?email=${email}&otp=${otp}`
    window.location.href = schema
  }

  const headerAuthLogin = () => {
    const email = searchParams.get('email')
    const otp = searchParams.get('otp')
    const data = {
      email,
      otp,
      source: 'web'
    }
    dispatch(jobbseekersLoginRequest(data))
  }

  const logSuccess = (data: any) => {
    const defaultToPath =
      data.is_profile_update_required || !data.is_profile_completed
        ? '/jobseeker-complete-profile'
        : `/jobs-hiring/job-search`
    let redirect = searchParams.get('redirect')
    if (Array.isArray(searchParams.get('redirect'))) {
      redirect = searchParams.get('redirect')[0]
    } else {
      redirect = searchParams.get('redirect')
    }
    router.push(redirect ? redirect : defaultToPath)
  }

  const loginFailed = (errorMessage: string | null) => {
    if (errorMessage) {
      dispatch(
        displayNotification({
          open: true,
          message: 'Oops! That magic link has expired. Please try again.',
          severity: 'warning'
        })
      )
    }
    const defaultToPath = '/get-started'
    const redirectFailParams = searchParams.get('redirect_fail')
    let redirectFail
    if (Array.isArray(redirectFailParams)) {
      redirectFail = redirectFailParams[0]
    } else {
      redirectFail = redirectFailParams
    }
    router.push(redirectFail ? redirectFail : defaultToPath)
  }

  const handleAppRedirectModal = () => {
    debugger
    headerAuthLogin()
    setIsShowAppRedirectModal(false)
    setCookieWithExpiry('isAppRedirectModalClosed', true, 1800) // cookie expires to renable auto show modal after 30 minutes

    // Enables scrolling again
    document.documentElement.classList.remove('modal-active')
  }

  return (
    <div>
      <ModalAppRedirect
        isShowModal={isShowAppRedirectModal}
        handleModal={handleAppRedirectModal}
        handleOpenAppCallBack={headerOpenApp}
      />
    </div>
  )
}

export default Verify
