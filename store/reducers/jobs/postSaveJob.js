import {
    POST_SAVE_JOB_REQUEST,
    POST_SAVE_JOB_SUCCESS,
    POST_SAVE_JOB_FAILED,
  } from 'store/types/jobs/postSaveJob'
  
  const initialState = {
    fetching: false,
    payload:{},
    response: {},
    error: null,
  }
  
  export default function postSaveJob(state = initialState, action) {
    switch (action.type) {
      case POST_SAVE_JOB_REQUEST:
        return { ...state, fetching: true, payload: action.payload }
      case POST_SAVE_JOB_SUCCESS:
        return { ...state, fetching: false, response: action.payload }
      case POST_SAVE_JOB_FAILED:
        return { ...state, fetching: false, error: action.error }
      default:
        return { ...state }
    }
  }
  