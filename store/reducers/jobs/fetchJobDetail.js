import {
  FETCH_JOB_DETAIL_REQUEST,
  FETCH_JOB_DETAIL_SUCCESS,
  FETCH_JOB_DETAIL_FAILED,
} from 'store/types/jobs/fetchJobDetail'

const initialState = {
  fetching: false,
  payload: {},
  response: {},
  error: null,
}

export default function fetchJobDetail(state = initialState, action) {
  switch (action.type) {
    case FETCH_JOB_DETAIL_REQUEST:
      return { ...state, fetching: true, payload: action.payload }
    case FETCH_JOB_DETAIL_SUCCESS:
      return { ...state, fetching: false, response: action.payload }
    case FETCH_JOB_DETAIL_FAILED:
      return { ...state, fetching: false, error: action.error }
    default:
      return { ...state }
  }
}
