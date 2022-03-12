import {
  FETCH_USER_EDUCATION_REQUEST,
  FETCH_USER_EDUCATION_SUCCESS,
  FETCH_USER_EDUCATION_FAILED
} from 'store/types/users/fetchUserEducation'

const fetchUserEducationRequest = (payload) => ({
  type: FETCH_USER_EDUCATION_REQUEST,
  payload,
})

const fetchUserEducationSuccess = (payload) => ({
  type: FETCH_USER_EDUCATION_SUCCESS,
  payload,
})

const fetchUserEducationFailed = (error) => ({
  type: FETCH_USER_EDUCATION_FAILED,
  error,
})

export { fetchUserEducationRequest, fetchUserEducationSuccess, fetchUserEducationFailed }
