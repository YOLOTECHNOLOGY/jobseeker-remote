import {
  FETCH_USER_EDUCATION_REQUEST,
  FETCH_USER_EDUCATION_SUCCESS,
  FETCH_USER_EDUCATION_FAILED,
} from 'store/types/users/fetchUserEducation'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchUserEducation(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_EDUCATION_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_USER_EDUCATION_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_USER_EDUCATION_FAILED:
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
