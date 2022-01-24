import {
    FETCH_SIMILAR_JOBS_REQUEST,
    FETCH_SIMILAR_JOBS_SUCCESS,
    FETCH_SIMILAR_JOBS_FAILED,
  } from 'store/types/jobs/fetchSimilarJobs'
  
  const fetchSimilarJobsRequest = (payload) => ({
    type: FETCH_SIMILAR_JOBS_REQUEST,
    payload,
  })
  
  const fetchSimilarJobsSuccess = (payload) => ({
    type: FETCH_SIMILAR_JOBS_SUCCESS,
    payload,
  })
  
  const fetchSimilarJobsFailed = (error) => ({
    type: FETCH_SIMILAR_JOBS_FAILED,
    error,
  })
  
  export { fetchSimilarJobsRequest, fetchSimilarJobsSuccess, fetchSimilarJobsFailed }
  