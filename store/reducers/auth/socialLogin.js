import {
  SOCIAL_LOGIN_REQUEST,
  SOCIAL_LOGIN_SUCCESS,
  SOCIAL_LOGIN_FAILED,
} from 'store/types/auth/socialLogin'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function socialLogin(state = initialState, action) {
  switch (action.type) {
    case SOCIAL_LOGIN_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case SOCIAL_LOGIN_FAILED:
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
