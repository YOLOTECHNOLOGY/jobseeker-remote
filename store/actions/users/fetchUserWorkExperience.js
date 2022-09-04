import {
  FETCH_USER_WORK_EXPERIENCE_REQUEST,
  FETCH_USER_WORK_EXPERIENCE_SUCCESS,
  FETCH_USER_WORK_EXPERIENCE_FAILED,
  FETCH_USER_WORK_EXPERIENCE_QUICK_UPLOAD_RESUME
} from 'store/types/users/fetchUserWorkExperience'

const fetchUserWorkExperienceRequest = (payload) => ({
  type: FETCH_USER_WORK_EXPERIENCE_REQUEST,
  payload
})

const fetchUserWorkExperienceSuccess = (payload) => ({
  type: FETCH_USER_WORK_EXPERIENCE_SUCCESS,
  payload
})

const fetchUserWorkExperienceFailed = (error) => ({
  type: FETCH_USER_WORK_EXPERIENCE_FAILED,
  error
})

const fetchUserWorkExperienceQuickUploadResume = (payload) => ({
  type: FETCH_USER_WORK_EXPERIENCE_QUICK_UPLOAD_RESUME,
  payload
})

export {
  fetchUserWorkExperienceRequest,
  fetchUserWorkExperienceSuccess,
  fetchUserWorkExperienceFailed,
  fetchUserWorkExperienceQuickUploadResume
}
