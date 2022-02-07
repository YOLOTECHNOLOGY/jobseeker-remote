import {
  CHECK_RESET_PASSWORD_CODE_REQUEST,
  CHECK_RESET_PASSWORD_CODE_SUCCESS,
  CHECK_RESET_PASSWORD_CODE_FAILED,
} from 'store/types/auth/checkResetPasswordCode'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function checkResetPasswordCode(state = initialState, action) {
  switch (action.type) {
    case CHECK_RESET_PASSWORD_CODE_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case CHECK_RESET_PASSWORD_CODE_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case CHECK_RESET_PASSWORD_CODE_FAILED:
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
