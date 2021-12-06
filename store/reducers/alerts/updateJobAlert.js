import {
  UPDATE_JOB_ALERT_REQUEST,
  UPDATE_JOB_ALERT_SUCCESS,
  UPDATE_JOB_ALERT_FAILED,
} from 'store/types/alerts/updateJobAlert'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function updateJobAlert(state = initialState, action) {
  switch (action.type) {
    case UPDATE_JOB_ALERT_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case UPDATE_JOB_ALERT_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case UPDATE_JOB_ALERT_FAILED:
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
