import {
  REGISTER_JOBSEEKER_REQUEST,
  REGISTER_JOBSEEKER_SUCCESS,
  REGISTER_JOBSEEKER_FAILED,
} from 'store/types/auth/registerJobseeker'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function registerJobseeker(state = initialState, action) {
  switch (action.type) {
    case REGISTER_JOBSEEKER_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case REGISTER_JOBSEEKER_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case REGISTER_JOBSEEKER_FAILED:
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
