import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { getItem } from 'helpers/localStorage'

import { SnackbarOrigin } from '@mui/material'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { registerJobseekerRequest } from 'store/actions/auth/registerJobseeker'
import { uploadUserResumeRequest } from 'store/actions/users/uploadUserResume'

import useRegisterInfo from 'hooks/useRegisterInfo'
import { addUserWorkExperienceService } from 'store/services/users/addUserWorkExperience'

import Link from 'components/Link'

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

  const {
    register,
    formState: { errors }
  } = useForm()

  const isRegisteringJobseeker = useSelector((store: any) => store.auth.registerJobseeker.fetching)
  const registerJobseekerState = useSelector((store: any) => store.auth.registerJobseeker)

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
    let emailErrorMessage = null

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      emailErrorMessage = 'Please enter a valid email address.'
    }

    setEmailError(emailErrorMessage)
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
          <Link to='/login/jobseeker' className='default'>
            log in
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

  const handleRegister = (isRedirect: HandleRegisterAng) => {
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
    isShowRegisterInfo
  }
}

export default useRegister
