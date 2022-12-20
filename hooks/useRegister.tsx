import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

// helpers
import { getItem, setItem } from 'helpers/localStorage'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { useFirstRender } from 'helpers/useFirstRender'
import { getCookie } from 'helpers/cookies'

// mui
import { SnackbarOrigin } from '@mui/material'

/* Redux Actions */
import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { uploadUserResumeRequest } from 'store/actions/users/uploadUserResume'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// hooks
import useGetStarted from 'hooks/useGetStarted'
import useRegisterInfo from 'hooks/useRegisterInfo'

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

  const {
    step,
    email,
    setEmaile,
    handleSendEmailTOP,
    isLoading: requestOTPLOading,
    userId,
    emailTOP,
    setEmailTOP,
    emailOTPInputDisabled,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    emailTOPError
  } = useGetStarted()

  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()

  // const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  const [sendOTPBtnDisabled, setSendOTPBtnDisabled] = useState<boolean>(true)

  const {
    register,
    formState: { errors }
  } = useForm()

  // OTPLOgin or OTPRegister
  const OTPLoginUserInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
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
          severity: 'error'
        })
      )
    }
  }, [jobseekersSocialFailed])

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
    const { data } = jobseekersSocialResponse
    if (data?.token || Object.keys(OTPLoginUserInfo).length) {
      const accessToken = getCookie('accessToken')
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
            const isChatRedirect = sessionStorage.getItem('isChatRedirect')
            if (isChatRedirect) {
              router.push(isChatRedirect)
              sessionStorage.removeItem('isChatRedirect')
            } else {
              router.push('/jobs-hiring/job-search')
            }
          } else {
            router.push('/jobseeker-complete-profile/1')
          }
        }
      } else if (accessToken) {
        // job details login
        if (userId) {
          const isChatRedirect = sessionStorage.getItem('isChatRedirect')
          if (isChatRedirect) {
            router.push(isChatRedirect)
            sessionStorage.removeItem('isChatRedirect')
          } else {
            window.location.reload()
          }
        } else {
          console.log('isRegisterModuleRedirect',userId)
          setItem('isRegisterModuleRedirect', router.asPath)
          router.push('/jobseeker-complete-profile/1')
        }
      }
    }
  }, [OTPLoginUserInfo, jobseekersSocialResponse])

  const socialAUTHLoginCallBack = (payload) => {
    // dispatch(socialLoginRequest(payload))
    const data = {
      ...payload,
      ...router.query,
      // avatar: payload.pictureUrl ? payload.pictureUrl : '',
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: width > 576 ? 'web' : 'mobile_web'
    }
    if (payload.pictureUrl) {
      data.avatar = payload.pictureUrl
    }
    dispatch(jobbseekersSocialLoginRequest(data))
  }

  return {
    email,
    setEmail: setEmaile,
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
    OTPIsLoading: requestOTPLOading,
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
