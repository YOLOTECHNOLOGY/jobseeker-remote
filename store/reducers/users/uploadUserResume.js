import {
  UPLOAD_USER_RESUME_REQUEST,
  UPLOAD_USER_RESUME_SUCCESS,
  UPLOAD_USER_RESUME_FAILED,
} from 'store/types/users/uploadUserResume'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function uploadUserResume(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_USER_RESUME_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case UPLOAD_USER_RESUME_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case UPLOAD_USER_RESUME_FAILED:
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
