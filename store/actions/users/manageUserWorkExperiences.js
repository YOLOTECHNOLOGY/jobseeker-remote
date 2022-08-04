import {
  MANAGE_USER_WORK_EXPERIENCES_REQUEST,
  MANAGE_USER_WORK_EXPERIENCES_SUCCESS,
  MANAGE_USER_WORK_EXPERIENCES_FAILED,
} from 'store/types/users/manageUserWorkExperiences'

const manageUserWorkExperiencesRequest = (payload) => ({
  type: MANAGE_USER_WORK_EXPERIENCES_REQUEST,
  payload,
})

const manageUserWorkExperiencesSuccess = (payload) => ({
  type: MANAGE_USER_WORK_EXPERIENCES_SUCCESS,
  payload,
})

const manageUserWorkExperiencesFailed = (error) => ({
  type: MANAGE_USER_WORK_EXPERIENCES_FAILED,
  error,
})

export {
  manageUserWorkExperiencesRequest,
  manageUserWorkExperiencesSuccess,
  manageUserWorkExperiencesFailed,
}
