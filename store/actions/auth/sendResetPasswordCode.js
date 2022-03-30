import {
  SEND_RESET_PASSWORD_CODE_REQUEST,
  SEND_RESET_PASSWORD_CODE_SUCCESS,
  SEND_RESET_PASSWORD_CODE_FAILED
} from 'store/types/auth/sendResetPasswordCode'

const sendResetPasswordCodeRequest = (payload) => ({
  type: SEND_RESET_PASSWORD_CODE_REQUEST,
  payload,
})

const sendResetPasswordCodeSuccess = (payload) => ({
  type: SEND_RESET_PASSWORD_CODE_SUCCESS,
  payload,
})

const sendResetPasswordCodeFailed = (error) => ({
  type: SEND_RESET_PASSWORD_CODE_FAILED,
  error,
})

export { sendResetPasswordCodeRequest, sendResetPasswordCodeSuccess, sendResetPasswordCodeFailed }
