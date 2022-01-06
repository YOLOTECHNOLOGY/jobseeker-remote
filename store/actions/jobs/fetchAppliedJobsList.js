import {
    FETCH_APPLIED_JOBS_LIST_REQUEST,
    FETCH_APPLIED_JOBS_LIST_SUCCESS,
    FETCH_APPLIED_JOBS_LIST_FAILED,
    CLEAR_FETCH_APPLIED_JOBS_LIST,
  } from 'store/types/jobs/fetchAppliedJobsList'
  
  const fetchAppliedJobsListRequest = (payload) => ({
    type: FETCH_APPLIED_JOBS_LIST_REQUEST,
    payload,
  })
  
  const fetchAppliedJobsListSuccess = (payload) => ({
    type: FETCH_APPLIED_JOBS_LIST_SUCCESS,
    payload,
  })
  
  const fetchAppliedJobsListFailed = (error) => ({
    type: FETCH_APPLIED_JOBS_LIST_FAILED,
    error,
  })
  
  const clearFetchAppliedJobsList = () => ({
    type: CLEAR_FETCH_APPLIED_JOBS_LIST,
  })
  
  export { fetchAppliedJobsListRequest, fetchAppliedJobsListSuccess, fetchAppliedJobsListFailed, clearFetchAppliedJobsList }
  