import {
  FETCH_JOB_DETAIL_REQUEST,
  FETCH_JOB_DETAIL_SUCCESS,
  FETCH_JOB_DETAIL_FAILED,
} from 'store/types/jobs/fetchJobDetail'

const fetchJobDetailRequest = (payload) => ({
  type: FETCH_JOB_DETAIL_REQUEST,
  payload,
})

const fetchJobDetailSuccess = (payload) => ({
  type: FETCH_JOB_DETAIL_SUCCESS,
  payload,
})

const fetchJobDetailFailed = (error) => ({
  type: FETCH_JOB_DETAIL_FAILED,
  error,
})
export { fetchJobDetailRequest, fetchJobDetailSuccess, fetchJobDetailFailed }
