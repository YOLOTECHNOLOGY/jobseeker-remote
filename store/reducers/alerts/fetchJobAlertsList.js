import {
  FETCH_JOB_ALERTS_LIST_REQUEST,
  FETCH_JOB_ALERTS_LIST_SUCCESS,
  FETCH_JOB_ALERTS_LIST_FAILED,
} from 'store/types/alerts/fetchJobAlertsList'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchJobAlertsList(state = initialState, action) {
  switch (action.type) {
    case FETCH_JOB_ALERTS_LIST_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_JOB_ALERTS_LIST_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_JOB_ALERTS_LIST_FAILED:
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
