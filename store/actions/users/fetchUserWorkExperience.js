import {
  FETCH_USER_WORK_EXPERIENCE_REQUEST,
  FETCH_USER_WORK_EXPERIENCE_SUCCESS,
  FETCH_USER_WORK_EXPERIENCE_FAILED
} from 'store/types/users/fetchUserWorkExperience'

const fetchUserWorkExperienceRequest = (payload) => ({
  type: FETCH_USER_WORK_EXPERIENCE_REQUEST,
  payload,
})

const fetchUserWorkExperienceSuccess = (payload) => ({
  type: FETCH_USER_WORK_EXPERIENCE_SUCCESS,
  payload,
})

const fetchUserWorkExperienceFailed = (error) => ({
  type: FETCH_USER_WORK_EXPERIENCE_FAILED,
  error,
})

export { fetchUserWorkExperienceRequest, fetchUserWorkExperienceSuccess, fetchUserWorkExperienceFailed }
