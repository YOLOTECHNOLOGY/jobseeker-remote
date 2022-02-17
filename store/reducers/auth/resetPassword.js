import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED,
} from 'store/types/auth/resetPassword'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function resetPassword(state = initialState, action) {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case RESET_PASSWORD_FAILED:
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
