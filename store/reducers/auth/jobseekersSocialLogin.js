import {
  JOBBSEEKERS_SOCIALLOGIN_REQUEST,
  JOBBSEEKERS_SOCIALLOGIN_SUCCESS,
  JOBBSEEKERS_SOCIALLOGIN_FAILED,
  JOBBSEEKERS_SOCIALLOGIN_CLEAR
} from 'store/types/auth/jobseekersSocialLogin'

const initialState = {
  fetching: false,
  response: {},
  error: null
}

export default function jobseekersSocialLogin(state = initialState, action) {
  switch (action.type) {
    case JOBBSEEKERS_SOCIALLOGIN_REQUEST:
      return {
        ...state,
        fetching: true
      }
    case JOBBSEEKERS_SOCIALLOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null
      }
    case JOBBSEEKERS_SOCIALLOGIN_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {}
      }
      case JOBBSEEKERS_SOCIALLOGIN_CLEAR:
        return {
          ...state,
          fetching: false,
          error: null,
          response: {}
        }
    default:
      return { ...state }
  }
}
