import {
  DELETE_JOB_ALERT_REQUEST,
  DELETE_JOB_ALERT_SUCCESS,
  DELETE_JOB_ALERT_FAILED
} from 'store/types/alerts/deleteJobAlert'

const deleteJobAlertRequest = (payload) => ({
  type: DELETE_JOB_ALERT_REQUEST,
  payload,
})

const deleteJobAlertSuccess = (payload) => ({
  type: DELETE_JOB_ALERT_SUCCESS,
  payload,
})

const deleteJobAlertFailed = (error) => ({
  type: DELETE_JOB_ALERT_FAILED,
  error,
})

export { deleteJobAlertRequest, deleteJobAlertSuccess, deleteJobAlertFailed }
