import {
  REGISTER_RECRUITER_REQUEST,
  REGISTER_RECRUITER_SUCCESS,
  REGISTER_RECRUITER_FAILED,
} from 'store/types/auth/registerRecruiter'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function registerRecuiter(state = initialState, action) {
  switch (action.type) {
    case REGISTER_RECRUITER_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case REGISTER_RECRUITER_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case REGISTER_RECRUITER_FAILED:
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
