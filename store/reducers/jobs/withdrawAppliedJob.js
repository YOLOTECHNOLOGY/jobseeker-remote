import {
    WITHDRAW_APPLIED_JOB_REQUEST,
    WITHDRAW_APPLIED_JOB_SUCCESS,
    WITHDRAW_APPLIED_JOB_FAILED,
  } from 'store/types/jobs/withdrawAppliedJob'
  
  const initialState = {
    fetching: false,
    payload:{},
    response: {},
    error: null,
  }
  
  export default function withdrawAppliedJob(state = initialState, action) {
    switch (action.type) {
      case WITHDRAW_APPLIED_JOB_REQUEST:
        return { ...state, fetching: true, payload: action.payload }
      case WITHDRAW_APPLIED_JOB_SUCCESS:
        return { ...state, fetching: false, response: action.payload }
      case WITHDRAW_APPLIED_JOB_FAILED:
        return { ...state, fetching: false, error: action.error }
      default:
        return { ...state }
    }
  }
  