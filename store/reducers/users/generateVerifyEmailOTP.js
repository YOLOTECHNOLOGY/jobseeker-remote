import {
  GENERATE_VERIFY_EMAIL_OTP_REQUEST,
  GENERATE_VERIFY_EMAIL_OTP_SUCCESS,
  GENERATE_VERIFY_EMAIL_OTP_FAILED,
} from 'store/types/users/generateVerifyEmailOTP'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function generateVerifyEmailOTP(state = initialState, action) {
  switch (action.type) {
    case GENERATE_VERIFY_EMAIL_OTP_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case GENERATE_VERIFY_EMAIL_OTP_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case GENERATE_VERIFY_EMAIL_OTP_FAILED:
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
