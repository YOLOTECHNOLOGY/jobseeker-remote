import {
    DELETE_SAVE_JOB_REQUEST,
    DELETE_SAVE_JOB_SUCCESS,
    DELETE_SAVE_JOB_FAILED,
  } from 'store/types/jobs/deleteSaveJob'
  
  const deleteSaveJobRequest = (payload) => ({
    type: DELETE_SAVE_JOB_REQUEST,
    payload,
  })
  
  const deleteSaveJobSuccess = (payload) => ({
    type: DELETE_SAVE_JOB_SUCCESS,
    payload,
  })
  
  const deleteSaveJobFailed = (error) => ({
    type: DELETE_SAVE_JOB_FAILED,
    error,
  })
  
  export { deleteSaveJobRequest, deleteSaveJobSuccess, deleteSaveJobFailed }
  