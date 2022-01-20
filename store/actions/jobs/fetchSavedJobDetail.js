import {
    FETCH_SAVED_JOB_DETAIL_REQUEST,
    FETCH_SAVED_JOB_DETAIL_SUCCESS,
    FETCH_SAVED_JOB_DETAIL_FAILED,
  } from 'store/types/jobs/fetchSavedJobDetail'
  
  const fetchSavedJobDetailRequest = (payload) => ({
    type: FETCH_SAVED_JOB_DETAIL_REQUEST,
    payload,
  })
  
  const fetchSavedJobDetailSuccess = (payload) => ({
    type: FETCH_SAVED_JOB_DETAIL_SUCCESS,
    payload,
  })
  
  const fetchSavedJobDetailFailed = (error) => ({
    type: FETCH_SAVED_JOB_DETAIL_FAILED,
    error,
  })
  
  export { fetchSavedJobDetailRequest, fetchSavedJobDetailSuccess, fetchSavedJobDetailFailed }
  