import {
  SEND_RESET_PASSWORD_CODE_REQUEST,
  SEND_RESET_PASSWORD_CODE_SUCCESS,
  SEND_RESET_PASSWORD_CODE_FAILED,
} from 'store/types/auth/sendResetPasswordCode'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function sendResetPasswordCode(state = initialState, action) {
  switch (action.type) {
    case SEND_RESET_PASSWORD_CODE_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case SEND_RESET_PASSWORD_CODE_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case SEND_RESET_PASSWORD_CODE_FAILED:
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
