import {
    WITHDRAW_APPLIED_JOB_REQUEST,
    WITHDRAW_APPLIED_JOB_SUCCESS,
    WITHDRAW_APPLIED_JOB_FAILED,
  } from 'store/types/jobs/withdrawAppliedJob'
  
  const withdrawAppliedJobRequest = (payload) => ({
    type: WITHDRAW_APPLIED_JOB_REQUEST,
    payload,
  })
  
  const withdrawAppliedJobSuccess = (payload) => ({
    type: WITHDRAW_APPLIED_JOB_SUCCESS,
    payload,
  })
  
  const withdrawAppliedJobFailed = (error) => ({
    type: WITHDRAW_APPLIED_JOB_FAILED,
    error,
  })
  
  export { withdrawAppliedJobRequest, withdrawAppliedJobSuccess, withdrawAppliedJobFailed }
  