import {
    FETCH_APPLIED_JOB_DETAIL_REQUEST,
    FETCH_APPLIED_JOB_DETAIL_SUCCESS,
    FETCH_APPLIED_JOB_DETAIL_FAILED,
  } from 'store/types/jobs/fetchAppliedJobDetail'
  
  const fetchAppliedJobDetailRequest = (payload) => ({
    type: FETCH_APPLIED_JOB_DETAIL_REQUEST,
    payload,
  })
  
  const fetchAppliedJobDetailSuccess = (payload) => ({
    type: FETCH_APPLIED_JOB_DETAIL_SUCCESS,
    payload,
  })
  
  const fetchAppliedJobDetailFailed = (error) => ({
    type: FETCH_APPLIED_JOB_DETAIL_FAILED,
    error,
  })
  
  export { fetchAppliedJobDetailRequest, fetchAppliedJobDetailSuccess, fetchAppliedJobDetailFailed }
  