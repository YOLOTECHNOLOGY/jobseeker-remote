import {
  FETCH_JOBS_LIST_REQUEST,
  FETCH_JOBS_LIST_SUCCESS,
  FETCH_JOBS_LIST_FAILED,
  CLEAR_FETCH_JOBS_LIST,
} from 'store/types/jobs/fetchJobsList'

const fetchJobsListRequest = (payload) => ({
  type: FETCH_JOBS_LIST_REQUEST,
  payload,
})

const fetchJobsListSuccess = (payload) => ({
  type: FETCH_JOBS_LIST_SUCCESS,
  payload,
})

const fetchJobsListFailed = (error) => ({
  type: FETCH_JOBS_LIST_FAILED,
  error,
})

const clearFetchJobsList = () => ({
  type: CLEAR_FETCH_JOBS_LIST,
})

export { fetchJobsListRequest, fetchJobsListSuccess, fetchJobsListFailed, clearFetchJobsList }
