import {
  FETCH_RECOMMENDED_COURSES_REQUEST,
  FETCH_RECOMMENDED_COURSES_SUCCESS,
  FETCH_RECOMMENDED_COURSES_FAILED
} from 'store/types/courses/fetchRecommendedCourses'

const fetchRecommendedCoursesRequest = (payload) => ({
  type: FETCH_RECOMMENDED_COURSES_REQUEST,
  payload,
})

const fetchRecommendedCoursesSuccess = (payload) => ({
  type: FETCH_RECOMMENDED_COURSES_SUCCESS,
  payload,
})

const fetchRecommendedCoursesFailed = (error) => ({
  type: FETCH_RECOMMENDED_COURSES_FAILED,
  error,
})

export { fetchRecommendedCoursesRequest, fetchRecommendedCoursesSuccess, fetchRecommendedCoursesFailed }
