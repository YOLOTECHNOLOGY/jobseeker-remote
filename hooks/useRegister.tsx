import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { getItem, removeItem, setItem } from 'helpers/localStorage'
import useWindowDimensions from 'helpers/useWindowDimensions'

import { SnackbarOrigin } from '@mui/material'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { registerJobseekerRequest } from 'store/actions/auth/registerJobseeker'
import { uploadUserResumeRequest } from 'store/actions/users/uploadUserResume'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

import useRegisterInfo from 'hooks/useRegisterInfo'
import { useFirstRender } from 'helpers/useFirstRender'

// api
import { addUserWorkExperienceService } from 'store/services/users/addUserWorkExperience'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { authenticationSendEmailMagicLink } from 'store/services/auth/authenticationSendEmailMagicLink'

import Link from 'components/Link'
import { RouteSharp } from '@mui/icons-material'

export interface SnackbarType extends SnackbarOrigin {
  open: boolean
}

type HandleRegisterAng = boolean | any

const useRegister = () => {
  const {
    vertical,
    horizontal,
    open,
    handleSnackbarClose,
    isLoading,
    uploadResumeFile,
    setSnackbarState,
    userInfo,
    isShowRegisterInfo,
    userWorkExperiences
  } = useRegisterInfo()

  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()

  const [firstName, setFirstName] = useState('')
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastName, setLastName] = useState('')
  const [lastNameError, setLastNameError] = useState(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  const [password, setPassword] = useState('')
  const [isSubscribe, setIsSubscribe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)

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

  const isRegisteringJobseeker = useSelector((store: any) => store.auth.registerJobseeker.fetching)
  const registerJobseekerState = useSelector((store: any) => store.auth.registerJobseeker)

  const OTPLoginUserInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const OTPLoginError = useSelector((store: any) => store.auth.jobseekersLogin.error)

  const handleOnShowPassword = () => setShowPassword(!showPassword)

  useEffect(() => {
    if (firstName) {
      setFirstNameError(null)
    }
  }, [firstName])

  useEffect(() => {
    if (lastName) {
      setLastNameError(null)
    }
  }, [lastName])

  useEffect(() => {
    if (!Object.keys(OTPLoginUserInfo).length) {
      return
    }
    logSuccess()
  }, [OTPLoginUserInfo])

  useEffect(() => {
    if (OTPLoginError === null) {
      return
    }
    const errorMessage = OTPLoginError.data?.errors?.error[0]
    loginFailed(errorMessage)
  }, [OTPLoginError])

  const logSuccess = () => {
    const url = userId ? router.asPath : '/jobseeker-complete-profile/1'
    router.push(url)
    setEmailOTPInputDisabled(false)
  }

  const loginFailed = (errorMessage: string | null) => {
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
    let passwordErrorMessage = null

    if (password?.length > 0 && password?.length < 8) {
      passwordErrorMessage = 'Please enter a longer password(minimum of 8 characters)'
    } else if (password?.length > 16) {
      passwordErrorMessage = 'Please enter a shorter password(maximum of 16 characters)'
    } else {
      passwordErrorMessage = null
    }
    setPasswordError(passwordErrorMessage)
  }, [password])

  useEffect(() => {
    if (registerJobseekerState.error === 'The email has already been taken.') {
      setEmailError(
        <p>
          A user with this email address already exists. Please enter a different email address or{' '}
          <Link to='/get-started' className='default'>
            Get started
          </Link>
          .
        </p>
      )
    }
  }, [registerJobseekerState])

  useEffect(() => {
    const accessToken = registerJobseekerState?.response?.data?.authentication?.access_token
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
        const workExperiencesPayload = {
          accessToken,
          workExperience: null
        }
        const workListRequest = []
        userWorkExperiences.forEach((element) => {
          workExperiencesPayload.workExperience = element
          workListRequest.push(addUserWorkExperienceService(workExperiencesPayload))
        })
        Promise.all(workListRequest).then((res) => {
          if (res.length) {
            router.push('/jobseeker-complete-profile/1')
          }
        })
        // dispatch(updateUserOnboardingInfoRequest(workExperiencesPayload))
      } else {
        // noworkExperiences
        router.push('/jobseeker-complete-profile/1')
      }
    }
  }, [userInfo])

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

  const handleAuthenticationSendEmailMagicLink = () => {
    authenticationSendEmailMagicLink({ email })
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
        setOTPIsLoading(false)
      })
  }

  const handleRegister = (isRedirect: HandleRegisterAng, isRegisterModuleRedirect?) => {
    if (!firstName) {
      setFirstNameError('Please enter your first name.')
    }

    if (!lastName) {
      setLastNameError('Please enter your last name.')
    }

    if (!email) {
      setEmailError('Please enter your email address.')
    }

    if (!password) {
      setPasswordError('Please enter a longer password(minimum of 8 characters)')
    }

    if (
      firstName &&
      lastName &&
      email &&
      password &&
      !firstNameError &&
      !lastNameError &&
      !emailError &&
      !passwordError
    ) {
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        terms_and_condition: false,
        is_subscribe: isSubscribe,
        redirect: router.query?.redirect || null,
        isRedirect
      }

      if (!isRedirect) {
        // increates user conversion  quick register
        if (
          !uploadResumeFile?.size &&
          !userWorkExperiences.length &&
          !userWorkExperiences?.hasNoWorkExperience
        ) {
          setSnackbarState({
            vertical: 'top',
            horizontal: 'center',
            open: true
          })
          return false
        }
        removeItem('isRegisterModuleRedirect')
      }

      if (isRegisterModuleRedirect) {
        setItem('isRegisterModuleRedirect', router.asPath)
        removeItem('quickUpladResume')
      }

      dispatch(registerJobseekerRequest({ ...payload }))
    }
  }

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return {
    firstName,
    setFirstName,
    firstNameError,
    setFirstNameError,
    lastName,
    setLastName,
    lastNameError,
    setLastNameError,
    email,
    setEmail,
    emailError,
    setEmailError,
    password,
    setPassword,
    passwordError,
    setPasswordError,
    showPassword,
    setShowPassword,
    isSubscribe,
    setIsSubscribe,
    errors,
    register,
    handleRegister,
    isRegisteringJobseeker,
    registerJobseekerState,
    handleOnShowPassword,
    callbackRequest,
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
