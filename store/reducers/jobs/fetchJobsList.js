import {
  FETCH_JOBS_LIST_REQUEST,
  FETCH_JOBS_LIST_SUCCESS,
  FETCH_JOBS_LIST_FAILED,
  CLEAR_FETCH_JOBS_LIST,
} from 'store/types/jobs/fetchJobsList'

const initialState = {
  fetching: false,
  payload:{},
  response: {},
  error: null,
}

export default function fetchJobsList(state = initialState, action) {
  switch (action.type) {
    case FETCH_JOBS_LIST_REQUEST:
      return { ...state, fetching: true, payload: action.payload }
    case FETCH_JOBS_LIST_SUCCESS:
      return { ...state, fetching: false, response: action.payload }
    case FETCH_JOBS_LIST_FAILED:
      return { ...state, fetching: false, error: action.error }
    case CLEAR_FETCH_JOBS_LIST:
      return { ...state, fetching: false, payload: {}, response: {}, error: '' }
    default:
      return { ...state }
  }
}
