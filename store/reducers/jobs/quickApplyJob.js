import {
	QUICK_APPLY_JOB_REQUEST,
	QUICK_APPLY_JOB_SUCCESS,
	QUICK_APPLY_JOB_FAILED,
  } from 'store/types/jobs/quickApplyJob'
  
  const initialState = {
	fetching: false,
	payload:{},
	response: {},
	error: null,
  }
  
  export default function quickApplyJobReducer(state = initialState, action) {
	switch (action.type) {
	  case QUICK_APPLY_JOB_REQUEST:
		return { ...state, fetching: true, payload: action.payload }
	  case QUICK_APPLY_JOB_SUCCESS:
		return { ...state, fetching: false, response: action.payload }
	  case QUICK_APPLY_JOB_FAILED:
		return { ...state, fetching: false, error: action.error }
	  default:
		return { ...state }
	}
  }
  