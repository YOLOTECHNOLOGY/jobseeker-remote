import {
  CREATE_JOB_ALERT_REQUEST,
  CREATE_JOB_ALERT_SUCCESS,
  CREATE_JOB_ALERT_FAILED,
} from 'store/types/alerts/createJobAlert'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function createJobAlert(state = initialState, action) {
  switch (action.type) {
    case CREATE_JOB_ALERT_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case CREATE_JOB_ALERT_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case CREATE_JOB_ALERT_FAILED:
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
