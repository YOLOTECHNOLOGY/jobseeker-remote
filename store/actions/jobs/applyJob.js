import {
    APPLY_JOB_REQUEST,
    APPLY_JOB_SUCCESS,
    APPLY_JOB_FAILED,
  } from 'store/types/jobs/applyJob'
  
  const applyJobRequest = (payload) => ({
    type: APPLY_JOB_REQUEST,
    payload,
  })
  
  const applyJobSuccess = (payload) => ({
    type: APPLY_JOB_SUCCESS,
    payload,
  })
  
  const applyJobFailed = (error) => ({
    type: APPLY_JOB_FAILED,
    error,
  })
  
  export { applyJobRequest, applyJobSuccess, applyJobFailed }
  