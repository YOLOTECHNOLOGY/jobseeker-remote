import {
  GENERATE_USER_RESUME_REQUEST,
  GENERATE_USER_RESUME_SUCCESS,
  GENERATE_USER_RESUME_FAILED
} from 'store/types/users/generateUserResume'

const generateUserResumeRequest = (payload) => ({
  type: GENERATE_USER_RESUME_REQUEST,
  payload,
})

const generateUserResumeSuccess = (payload) => ({
  type: GENERATE_USER_RESUME_SUCCESS,
  payload,
})

const generateUserResumeFailed = (error) => ({
  type: GENERATE_USER_RESUME_FAILED,
  error,
})

export { generateUserResumeRequest, generateUserResumeSuccess, generateUserResumeFailed }
