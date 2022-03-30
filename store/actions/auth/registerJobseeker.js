import {
  REGISTER_JOBSEEKER_REQUEST,
  REGISTER_JOBSEEKER_SUCCESS,
  REGISTER_JOBSEEKER_FAILED
} from 'store/types/auth/registerJobseeker'

const registerJobseekerRequest = (payload) => ({
  type: REGISTER_JOBSEEKER_REQUEST,
  payload,
})

const registerJobseekerSuccess = (payload) => ({
  type: REGISTER_JOBSEEKER_SUCCESS,
  payload,
})

const registerJobseekerFailed = (error) => ({
  type: REGISTER_JOBSEEKER_FAILED,
  error,
})

export { registerJobseekerRequest, registerJobseekerSuccess, registerJobseekerFailed }
