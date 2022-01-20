import {
    FETCH_APPLIED_JOB_DETAIL_REQUEST,
    FETCH_APPLIED_JOB_DETAIL_SUCCESS,
    FETCH_APPLIED_JOB_DETAIL_FAILED,
  } from 'store/types/jobs/fetchAppliedJobDetail'
  
  const initialState = {
    fetching: false,
    payload:{},
    response: {},
    error: null,
  }
  
  export default function fetchAppliedJobDetail(state = initialState, action) {
    switch (action.type) {
      case FETCH_APPLIED_JOB_DETAIL_REQUEST:
        return { ...state, fetching: true, payload: action.payload }
      case FETCH_APPLIED_JOB_DETAIL_SUCCESS:
        return { ...state, fetching: false, response: action.payload }
      case FETCH_APPLIED_JOB_DETAIL_FAILED:
        return { ...state, fetching: false, error: action.error }
      default:
        return { ...state }
    }
  }
  