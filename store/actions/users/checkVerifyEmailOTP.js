import {
  CHECK_VERIFY_EMAIL_OTP_REQUEST,
  CHECK_VERIFY_EMAIL_OTP_SUCCESS,
  CHECK_VERIFY_EMAIL_OTP_FAILED,
} from 'store/types/users/checkVerifyEmailOTP'

const checkVerifyEmailOTPRequest = (payload) => ({
  type: CHECK_VERIFY_EMAIL_OTP_REQUEST,
  payload,
})

const checkVerifyEmailOTPSuccess = (payload) => ({
  type: CHECK_VERIFY_EMAIL_OTP_SUCCESS,
  payload,
})

const checkVerifyEmailOTPFailed = (error) => ({
  type: CHECK_VERIFY_EMAIL_OTP_FAILED,
  error,
})

export { checkVerifyEmailOTPRequest, checkVerifyEmailOTPSuccess, checkVerifyEmailOTPFailed }
