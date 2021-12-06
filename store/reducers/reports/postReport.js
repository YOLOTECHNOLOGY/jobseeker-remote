import {
  POST_REPORT_REQUEST,
  POST_REPORT_SUCCESS,
  POST_REPORT_FAILED,
} from 'store/types/reports/postReport'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function postReport(state = initialState, action) {
  switch (action.type) {
    case POST_REPORT_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case POST_REPORT_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case POST_REPORT_FAILED:
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
