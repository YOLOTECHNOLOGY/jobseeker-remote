import {
    QUICK_APPLY_JOB_REQUEST,
    QUICK_APPLY_JOB_SUCCESS,
    QUICK_APPLY_JOB_FAILED,
  } from 'store/types/jobs/quickApplyJob'
  
  const quickApplyJobRequest = (payload) => ({
    type: QUICK_APPLY_JOB_REQUEST,
    payload,
  })
  
  const quickApplyJobSuccess = (payload) => ({
    type: QUICK_APPLY_JOB_SUCCESS,
    payload,
  })
  
  const quickApplyJobFailed = (error) => ({
    type: QUICK_APPLY_JOB_FAILED,
    error,
  })
  
  export { quickApplyJobRequest, quickApplyJobSuccess, quickApplyJobFailed }
  