import {
  CHECK_VERIFY_EMAIL_OTP_REQUEST,
  CHECK_VERIFY_EMAIL_OTP_SUCCESS,
  CHECK_VERIFY_EMAIL_OTP_FAILED,
} from 'store/types/users/checkVerifyEmailOTP'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function checkVerifyEmailOTP(state = initialState, action) {
  switch (action.type) {
    case CHECK_VERIFY_EMAIL_OTP_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case CHECK_VERIFY_EMAIL_OTP_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case CHECK_VERIFY_EMAIL_OTP_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {},
      }
    default:
      return { ...state }
  }
}
