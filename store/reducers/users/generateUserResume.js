import {
  GENERATE_USER_RESUME_REQUEST,
  GENERATE_USER_RESUME_SUCCESS,
  GENERATE_USER_RESUME_FAILED,
} from 'store/types/users/generateUserResume'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function generateUserResume(state = initialState, action) {
  switch (action.type) {
    case GENERATE_USER_RESUME_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case GENERATE_USER_RESUME_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case GENERATE_USER_RESUME_FAILED:
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
