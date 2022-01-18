import {
    POST_SAVE_JOB_REQUEST,
    POST_SAVE_JOB_SUCCESS,
    POST_SAVE_JOB_FAILED,
  } from 'store/types/jobs/postSaveJob'
  
  const postSaveJobRequest = (payload) => ({
    type: POST_SAVE_JOB_REQUEST,
    payload,
  })
  
  const postSaveJobSuccess = (payload) => ({
    type: POST_SAVE_JOB_SUCCESS,
    payload,
  })
  
  const postSaveJobFailed = (error) => ({
    type: POST_SAVE_JOB_FAILED,
    error,
  })
  
  export { postSaveJobRequest, postSaveJobSuccess, postSaveJobFailed }
  