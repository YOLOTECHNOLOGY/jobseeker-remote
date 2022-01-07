import {
    FETCH_SAVED_JOBS_LIST_REQUEST,
    FETCH_SAVED_JOBS_LIST_SUCCESS,
    FETCH_SAVED_JOBS_LIST_FAILED,
    CLEAR_FETCH_SAVED_JOBS_LIST,
  } from 'store/types/jobs/fetchSavedJobsList'
  
  const initialState = {
    fetching: false,
    payload:{},
    response: {},
    error: null,
  }
  
  export default function fetchSavedJobsList(state = initialState, action) {
    switch (action.type) {
      case FETCH_SAVED_JOBS_LIST_REQUEST:
        return { ...state, fetching: true, payload: action.payload }
      case FETCH_SAVED_JOBS_LIST_SUCCESS:
        return { ...state, fetching: false, response: action.payload }
      case FETCH_SAVED_JOBS_LIST_FAILED:
        return { ...state, fetching: false, error: action.error }
      case CLEAR_FETCH_SAVED_JOBS_LIST:
        return { ...state, fetching: false, payload: {}, response: {}, error: '' }
      default:
        return { ...state }
    }
  }
  