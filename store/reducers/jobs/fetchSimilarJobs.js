import {
    FETCH_SIMILAR_JOBS_REQUEST,
    FETCH_SIMILAR_JOBS_SUCCESS,
    FETCH_SIMILAR_JOBS_FAILED,
  } from 'store/types/jobs/fetchSimilarJobs'
  
  const initialState = {
    fetching: false,
    payload:{},
    response: {},
    error: null,
  }
  
  export default function fetchSimilarJobs(state = initialState, action) {
    switch (action.type) {
      case FETCH_SIMILAR_JOBS_REQUEST:
        return { ...state, fetching: true, payload: action.payload }
      case FETCH_SIMILAR_JOBS_SUCCESS:
        return { ...state, fetching: false, response: action.payload }
      case FETCH_SIMILAR_JOBS_FAILED:
        return { ...state, fetching: false, error: action.error }
      default:
        return { ...state }
    }
  }
  