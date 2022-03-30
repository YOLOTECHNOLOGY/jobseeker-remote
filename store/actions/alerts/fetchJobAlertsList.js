import {
  FETCH_JOB_ALERTS_LIST_REQUEST,
  FETCH_JOB_ALERTS_LIST_SUCCESS,
  FETCH_JOB_ALERTS_LIST_FAILED
} from 'store/types/alerts/fetchJobAlertsList'

const fetchJobAlertsListRequest = (payload) => ({
  type: FETCH_JOB_ALERTS_LIST_REQUEST,
  payload,
})

const fetchJobAlertsListSuccess = (payload) => ({
  type: FETCH_JOB_ALERTS_LIST_SUCCESS,
  payload,
})

const fetchJobAlertsListFailed = (error) => ({
  type: FETCH_JOB_ALERTS_LIST_FAILED,
  error,
})

export { fetchJobAlertsListRequest, fetchJobAlertsListSuccess, fetchJobAlertsListFailed }
