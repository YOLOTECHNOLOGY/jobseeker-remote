import {
  JOBBSEEKERS_SOCIALLOGIN_REQUEST,
  JOBBSEEKERS_SOCIALLOGIN_SUCCESS,
  JOBBSEEKERS_SOCIALLOGIN_FAILED
} from 'store/types/auth/jobseekersSocialLogin'

const jobbseekersSocialLoginRequest = (payload) => ({
  type: JOBBSEEKERS_SOCIALLOGIN_REQUEST,
  payload
})

const jobbseekersSocialLoginSuccess = (payload) => ({
  type: JOBBSEEKERS_SOCIALLOGIN_SUCCESS,
  payload
})

const jobbseekersSocialLoginFailed = (error) => ({
  type: JOBBSEEKERS_SOCIALLOGIN_FAILED,
  error
})

export {
  jobbseekersSocialLoginRequest,
  jobbseekersSocialLoginSuccess,
  jobbseekersSocialLoginFailed
}
