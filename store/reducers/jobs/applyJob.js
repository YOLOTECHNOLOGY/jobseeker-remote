import {
	APPLY_JOB_REQUEST,
	APPLY_JOB_SUCCESS,
	APPLY_JOB_FAILED,
  } from 'store/types/jobs/applyJob'
  
  const initialState = {
	fetching: false,
	payload:{},
	response: {},
	error: null,
  }
  
  export default function applyJobReducer(state = initialState, action) {
	switch (action.type) {
	  case APPLY_JOB_REQUEST:
		return { ...state, fetching: true, payload: action.payload }
	  case APPLY_JOB_SUCCESS:
		return { ...state, fetching: false, response: action.payload }
	  case APPLY_JOB_FAILED:
		return { ...state, fetching: false, error: action.error }
	  default:
		return { ...state }
	}
  }
  