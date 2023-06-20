import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
    userWorkExperiences,
    setSnackbarState
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
        router.push('/manage-profile?tab=resume')
      } else {
        router.push('/jobseeker-complete-profile')
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
            const isChatRedirect = localStorage.getItem('isChatRedirect')
            if (isChatRedirect) {
              router.push(isChatRedirect)
              localStorage.removeItem('isChatRedirect')
            } else {
              // /jobs-hiring/job-search
              router.push('/manage-profile')
            }
          } else {
            router.push('/jobseeker-complete-profile')
          }
        }
      } else if (accessToken) {
        // job details login
        if (userId) {
          const isChatRedirect = localStorage.getItem('isChatRedirect')
          if (isChatRedirect) {
            router.push(isChatRedirect)
            localStorage.removeItem('isChatRedirect')
          } else {
            window.location.reload()
          }
        } else {
          setItem('isRegisterModuleRedirect', location.pathname)
          router.push('/jobseeker-complete-profile')
        }
      }
    }
  }, [OTPLoginUserInfo, jobseekersSocialResponse])
  const searchParams = useSearchParams()
  const query: any = {}
  searchParams.forEach((value, key) => {
    query[key] = value
  })
  const socialAUTHLoginCallBack = (payload) => {
    // dispatch(socialLoginRequest(payload))
    const data = {
      ...payload,
      ...searchParams,
      // avatar: payload.pictureUrl ? payload.pictureUrl : '',
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: 'web'
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
    emailTOPError,
    setSnackbarState
  }
}

export default useRegister
