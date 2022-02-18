import {
  UPLOAD_USER_RESUME_REQUEST,
  UPLOAD_USER_RESUME_SUCCESS,
  UPLOAD_USER_RESUME_FAILED
} from 'store/types/users/uploadUserResume'

const uploadUserResumeRequest = (payload) => ({
  type: UPLOAD_USER_RESUME_REQUEST,
  payload,
})

const uploadUserResumeSuccess = (payload) => ({
  type: UPLOAD_USER_RESUME_SUCCESS,
  payload,
})

const uploadUserResumeFailed = (error) => ({
  type: UPLOAD_USER_RESUME_FAILED,
  error,
})

export { uploadUserResumeRequest, uploadUserResumeSuccess, uploadUserResumeFailed }
