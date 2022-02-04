import {
  FETCH_RECOMMENDED_COURSES_REQUEST,
  FETCH_RECOMMENDED_COURSES_SUCCESS,
  FETCH_RECOMMENDED_COURSES_FAILED,
} from 'store/types/courses/fetchRecommendedCourses'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchRecommendedCourses(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECOMMENDED_COURSES_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_RECOMMENDED_COURSES_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_RECOMMENDED_COURSES_FAILED:
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
