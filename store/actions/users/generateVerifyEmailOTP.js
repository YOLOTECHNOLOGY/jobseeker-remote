import {
  GENERATE_VERIFY_EMAIL_OTP_REQUEST,
  GENERATE_VERIFY_EMAIL_OTP_SUCCESS,
  GENERATE_VERIFY_EMAIL_OTP_FAILED,
} from 'store/types/users/generateVerifyEmailOTP'

const generateVerifyEmailOTPRequest = (payload) => ({
  type: GENERATE_VERIFY_EMAIL_OTP_REQUEST,
  payload,
})

const generateVerifyEmailOTPSuccess = (payload) => ({
  type: GENERATE_VERIFY_EMAIL_OTP_SUCCESS,
  payload,
})

const generateVerifyEmailOTPFailed = (error) => ({
  type: GENERATE_VERIFY_EMAIL_OTP_FAILED,
  error,
})

export {
  generateVerifyEmailOTPRequest,
  generateVerifyEmailOTPSuccess,
  generateVerifyEmailOTPFailed,
}
