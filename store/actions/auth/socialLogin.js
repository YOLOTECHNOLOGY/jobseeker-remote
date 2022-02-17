import {
  SOCIAL_LOGIN_REQUEST,
  SOCIAL_LOGIN_SUCCESS,
  SOCIAL_LOGIN_FAILED
} from 'store/types/auth/socialLogin'

const socialLoginRequest = (payload) => ({
  type: SOCIAL_LOGIN_REQUEST,
  payload,
})

const socialLoginSuccess = (payload) => ({
  type: SOCIAL_LOGIN_SUCCESS,
  payload,
})

const socialLoginFailed = (error) => ({
  type: SOCIAL_LOGIN_FAILED,
  error,
})

export { socialLoginRequest, socialLoginSuccess, socialLoginFailed }
