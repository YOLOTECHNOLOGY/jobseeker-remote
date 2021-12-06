import {
  UPDATE_JOB_ALERT_REQUEST,
  UPDATE_JOB_ALERT_SUCCESS,
  UPDATE_JOB_ALERT_FAILED
} from 'store/types/alerts/updateJobAlert'

const updateJobAlertRequest = (payload) => ({
  type: UPDATE_JOB_ALERT_REQUEST,
  payload,
})

const updateJobAlertSuccess = (payload) => ({
  type: UPDATE_JOB_ALERT_SUCCESS,
  payload,
})

const updateJobAlertFailed = (error) => ({
  type: UPDATE_JOB_ALERT_FAILED,
  error,
})

export { updateJobAlertRequest, updateJobAlertSuccess, updateJobAlertFailed }
