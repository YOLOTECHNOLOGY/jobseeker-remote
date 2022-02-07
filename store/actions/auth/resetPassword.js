import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED
} from 'store/types/auth/resetPassword'

const resetPasswordRequest = (payload) => ({
  type: RESET_PASSWORD_REQUEST,
  payload,
})

const resetPasswordSuccess = (payload) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload,
})

const resetPasswordFailed = (error) => ({
  type: RESET_PASSWORD_FAILED,
  error,
})

export { resetPasswordRequest, resetPasswordSuccess, resetPasswordFailed }
