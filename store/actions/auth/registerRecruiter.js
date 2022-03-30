import {
  REGISTER_RECRUITER_REQUEST,
  REGISTER_RECRUITER_SUCCESS,
  REGISTER_RECRUITER_FAILED
} from 'store/types/auth/registerRecruiter'

const registerRecruiterRequest = (payload) => ({
  type: REGISTER_RECRUITER_REQUEST,
  payload,
})

const registerRecruiterSuccess = (payload) => ({
  type: REGISTER_RECRUITER_SUCCESS,
  payload,
})

const registerRecruiterFailed = (error) => ({
  type: REGISTER_RECRUITER_FAILED,
  error,
})

export { registerRecruiterRequest, registerRecruiterSuccess, registerRecruiterFailed }
