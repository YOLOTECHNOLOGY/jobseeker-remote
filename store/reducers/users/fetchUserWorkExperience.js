import {
  FETCH_USER_WORK_EXPERIENCE_REQUEST,
  FETCH_USER_WORK_EXPERIENCE_SUCCESS,
  FETCH_USER_WORK_EXPERIENCE_FAILED,
} from 'store/types/users/fetchUserWorkExperience'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchUserWorkExperience(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_WORK_EXPERIENCE_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_USER_WORK_EXPERIENCE_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_USER_WORK_EXPERIENCE_FAILED:
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
