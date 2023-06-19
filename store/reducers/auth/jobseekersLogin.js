import {
  JOBBSEEKERS_LOGIN_REQUEST,
  JOBBSEEKERS_LOGIN_SUCCESS,
  JOBBSEEKERS_LOGIN_FAILED,
  JOBBSEEKERS_LOGIN_CLEAR
} from 'store/types/auth/jobseekersLogin'

const initialState = {
  fetching: false,
  response: {},
  error: null
}

export default function jobseekersLogin(state = initialState, action) {
  switch (action.type) {
    case JOBBSEEKERS_LOGIN_REQUEST:
      return {
        ...state,
        fetching: true
      }
    case JOBBSEEKERS_LOGIN_CLEAR:
      return {
        ...state,
        fetching: false,
        response: {},
      }
    case JOBBSEEKERS_LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null
      }
    case JOBBSEEKERS_LOGIN_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {}
      }

    default:
      return { ...state }
  }
}
