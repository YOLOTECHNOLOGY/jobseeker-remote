import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { getItem, setItem } from 'helpers/localStorage'
import useWindowDimensions from 'helpers/useWindowDimensions'

import { SnackbarOrigin } from '@mui/material'

/* Redux Actions */
import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { uploadUserResumeRequest } from 'store/actions/users/uploadUserResume'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

import useRegisterInfo from 'hooks/useRegisterInfo'
import { useFirstRender } from 'helpers/useFirstRender'

// api
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { authenticationSendEmailMagicLink } from 'store/services/auth/authenticationSendEmailMagicLink'

export interface SnackbarType extends SnackbarOrigin {
  open: boolean
}

const useRegister = () => {
  const {
    vertical,
    horizontal,
    open,
    handleSnackbarClose,
    isLoading,
    uploadResumeFile,
    isShowRegisterInfo,
    userWorkExperiences
  } = useRegisterInfo()

  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  const [sendOTPBtnDisabled, setSendOTPBtnDisabled] = useState<boolean>(true)
  const [OTPIsLoading, setOTPIsLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(null)
  const [step, setStep] = useState(1)
  const [emailTOP, setEmailTOP] = useState<number>()
  const [emailTOPError, setEmailTOPError] = useState(false)
  const [emailOTPInputDisabled, setEmailOTPInputDisabled] = useState(false)

  const {
    register,
    formState: { errors }
  } = useForm()

  // OTPLOgin or OTPRegister
  const OTPLoginUserInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const OTPLoginError = useSelector((store: any) => store.auth.jobseekersLogin.error)
  // upFile
  const fileResponse = useSelector((store: any) => store.users.uploadUserResume.response)

  // SocialAUTH
  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )
  const jobseekersSocialFailed = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.error
  )

  useEffect(() => {
    // test after delete
    if (jobseekersSocialFailed?.data) {
      const errorMessage = jobseekersSocialFailed?.data.errors?.email[0]
      dispatch(
        displayNotification({
          open: true,
          message: errorMessage,
          severity: 'warning'
        })
      )
    }
  }, [jobseekersSocialFailed])

  useEffect(() => {
    const { data } = jobseekersSocialResponse
    if (data?.token) {
      const url =
        data.is_profile_update_required || !data.is_profile_completed
          ? '/jobseeker-complete-profile/1'
          : `/jobs-hiring/job-search`
      router.push(url)
    }
  }, [jobseekersSocialResponse])

  useEffect(() => {
    const accessToken = OTPLoginUserInfo?.data?.token
    if (fileResponse?.id && accessToken) {
      if (userId) {
        router.push('/jobs-hiring/job-search')
      } else {
        router.push('/jobseeker-complete-profile/1')
      }
    }
  }, [fileResponse])

  useEffect(() => {
    if (!Object.keys(OTPLoginUserInfo).length) {
      return
    }
    logSuccess()
    setEmailOTPInputDisabled(false)
  }, [OTPLoginUserInfo])

  useEffect(() => {
    if (OTPLoginError === null) {
      return
    }
    loginFailed()
  }, [OTPLoginError])

  const logSuccess = () => {
    // const url = userId ? router.asPath : '/jobseeker-complete-profile/1'
    // router.push(url)
    // setEmailOTPInputDisabled(false)
  }

  const loginFailed = () => {
    setEmailTOPError(true)
    setEmailOTPInputDisabled(false)
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    if (emailError) {
      setSendOTPBtnDisabled(true)
    } else {
      setSendOTPBtnDisabled(false)
    }
  }, [emailError])

  useEffect(() => {
    if (firstRender) {
      return
    }

    let errorText = null
    if (!email.length || !/\S+@\S+\.\S+/.test(email)) {
      errorText = 'Please enter a valid email address.'
    }
    setEmailError(errorText)
  }, [email])

  useEffect(() => {
    const accessToken = OTPLoginUserInfo?.data?.token
    const createresumeType = getItem('quickUpladResume')
    if (createresumeType === 'upFile' && accessToken) {
      if (uploadResumeFile?.size && accessToken) {
        const payload = {
          resume: uploadResumeFile,
          accessToken: accessToken,
          redirect: false
        }
        dispatch(uploadUserResumeRequest(payload))
      }
    } else if (createresumeType === 'onLine' && accessToken) {
      if (userWorkExperiences.length) {
        // const workExperiencesPayload = {
        //   accessToken,
        //   workExperience: null
        // }
        // const workListRequest = []
        // userWorkExperiences.forEach((element) => {
        //   workExperiencesPayload.workExperience = element
        //   workListRequest.push(addUserWorkExperienceService(workExperiencesPayload))
        // })
        // Promise.all(workListRequest).then((res) => {
        //   if (res.length) {
        //     router.push('/jobseeker-complete-profile/1')
        //   }
        // })
        // dispatch(updateUserOnboardingInfoRequest(workExperiencesPayload))
      } else {
        // noworkExperiences
        if (userId) {
          router.push('/jobs-hiring/job-search')
        } else {
          router.push('/jobseeker-complete-profile/1')
        }
      }
    } else if (accessToken) {
      // job details login
      if (userId) {
        window.location.reload()
      } else {
        setItem('isRegisterModuleRedirect', router.asPath)
        router.push('/jobseeker-complete-profile/1')
      }
    }
  }, [OTPLoginUserInfo])

  const handleAuthenticationJobseekersLogin = () => {
    setEmailOTPInputDisabled(true)
    const data = {
      email,
      otp: emailTOP,
      source: width > 576 ? 'web' : 'mobile_web',
      ...router.query
    }
    dispatch(jobbseekersLoginRequest(data))
  }

  const handleAuthenticationSendEmailMagicLink = (redirectPath?: string) => {
    authenticationSendEmailMagicLink({ email, redirect_url: redirectPath ? redirectPath : '' })
      .then(({ data }) => {
        if (data.data) {
          setStep(3)
        }
      })
      .catch(() => {
        dispatch(
          displayNotification({
            open: true,
            message: 'send email magicLink failed',
            severity: 'warning'
          })
        )
      })
  }

  const handleSendEmailTOP = () => {
    setOTPIsLoading(true)
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
        const { data } = error?.response
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
        setOTPIsLoading(false)
      })
  }

  const socialAUTHLoginCallBack = (payload) => {
    // dispatch(socialLoginRequest(payload))
    const data = {
      ...payload,
      ...router.query,
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: width > 576 ? 'web' : 'mobile_web'
    }
    dispatch(jobbseekersSocialLoginRequest(data))
  }

  return {
    email,
    setEmail,
    emailError,
    setEmailError,
    errors,
    register,
    socialAUTHLoginCallBack,
    // quick upload resume
    vertical,
    horizontal,
    open,
    isLoading,
    handleSnackbarClose,
    uploadResumeFile,
    isShowRegisterInfo,
    userWorkExperiences,
    OTPIsLoading,
    handleSendEmailTOP,
    userId,
    sendOTPBtnDisabled,
    step,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    emailTOP,
    setEmailTOP,
    emailOTPInputDisabled,
    emailTOPError
  }
}

export default useRegister
