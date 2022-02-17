import {
  CHECK_RESET_PASSWORD_CODE_REQUEST,
  CHECK_RESET_PASSWORD_CODE_SUCCESS,
  CHECK_RESET_PASSWORD_CODE_FAILED
} from 'store/types/auth/checkResetPasswordCode'

const checkResetPasswordCodeRequest = (payload) => ({
  type: CHECK_RESET_PASSWORD_CODE_REQUEST,
  payload,
})

const checkResetPasswordCodeSuccess = (payload) => ({
  type: CHECK_RESET_PASSWORD_CODE_SUCCESS,
  payload,
})

const checkResetPasswordCodeFailed = (error) => ({
  type: CHECK_RESET_PASSWORD_CODE_FAILED,
  error,
})

export { checkResetPasswordCodeRequest, checkResetPasswordCodeSuccess, checkResetPasswordCodeFailed }
