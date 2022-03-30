import {
  CREATE_JOB_ALERT_REQUEST,
  CREATE_JOB_ALERT_SUCCESS,
  CREATE_JOB_ALERT_FAILED
} from 'store/types/alerts/createJobAlert'

const createJobAlertRequest = (payload) => ({
  type: CREATE_JOB_ALERT_REQUEST,
  payload,
})

const createJobAlertSuccess = (payload) => ({
  type: CREATE_JOB_ALERT_SUCCESS,
  payload,
})

const createJobAlertFailed = (error) => ({
  type: CREATE_JOB_ALERT_FAILED,
  error,
})

export { createJobAlertRequest, createJobAlertSuccess, createJobAlertFailed }
