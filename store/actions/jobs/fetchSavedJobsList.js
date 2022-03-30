import {
    FETCH_SAVED_JOBS_LIST_REQUEST,
    FETCH_SAVED_JOBS_LIST_SUCCESS,
    FETCH_SAVED_JOBS_LIST_FAILED,
    CLEAR_FETCH_SAVED_JOBS_LIST,
  } from 'store/types/jobs/fetchSavedJobsList'
  
  const fetchSavedJobsListRequest = (payload) => ({
    type: FETCH_SAVED_JOBS_LIST_REQUEST,
    payload,
  })
  
  const fetchSavedJobsListSuccess = (payload) => ({
    type: FETCH_SAVED_JOBS_LIST_SUCCESS,
    payload,
  })
  
  const fetchSavedJobsListFailed = (error) => ({
    type: FETCH_SAVED_JOBS_LIST_FAILED,
    error,
  })
  
  const clearFetchSavedJobsList = () => ({
    type: CLEAR_FETCH_SAVED_JOBS_LIST,
  })
  
  export { fetchSavedJobsListRequest, fetchSavedJobsListSuccess, fetchSavedJobsListFailed, clearFetchSavedJobsList }
  