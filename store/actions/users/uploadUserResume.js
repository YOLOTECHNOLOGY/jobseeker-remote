import {
  UPLOAD_USER_RESUME_REQUEST,
  UPLOAD_USER_RESUME_SUCCESS,
  UPLOAD_USER_RESUME_FAILED,
  SAVE_USER_DEV_UPDATE_RESUME_FILE_INFO
} from 'store/types/users/uploadUserResume'

const uploadUserResumeRequest = (payload) => ({
  type: UPLOAD_USER_RESUME_REQUEST,
  payload
})

const uploadUserResumeSuccess = (payload) => ({
  type: UPLOAD_USER_RESUME_SUCCESS,
  payload
})

const uploadUserResumeFailed = (error) => ({
  type: UPLOAD_USER_RESUME_FAILED,
  error
})

const saveUserDevUpdateResumeFileInfo = (payload) => ({
  type: SAVE_USER_DEV_UPDATE_RESUME_FILE_INFO,
  payload
})

export {
  uploadUserResumeRequest,
  uploadUserResumeSuccess,
  uploadUserResumeFailed,
  saveUserDevUpdateResumeFileInfo
}
