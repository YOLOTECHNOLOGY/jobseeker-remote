import {
  DELETE_JOB_ALERT_REQUEST,
  DELETE_JOB_ALERT_SUCCESS,
  DELETE_JOB_ALERT_FAILED,
} from 'store/types/alerts/deleteJobAlert'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function deleteJobAlert(state = initialState, action) {
  switch (action.type) {
    case DELETE_JOB_ALERT_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case DELETE_JOB_ALERT_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case DELETE_JOB_ALERT_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {},
      }
    default:
      return { ...state }
  }
}
