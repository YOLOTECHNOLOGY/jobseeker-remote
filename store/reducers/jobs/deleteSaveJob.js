import {
  DELETE_SAVE_JOB_REQUEST,
  DELETE_SAVE_JOB_SUCCESS,
  DELETE_SAVE_JOB_FAILED,
} from 'store/types/jobs/deleteSaveJob'

const initialState = {
  fetching: false,
  payload:{},
  response: {},
  error: null,
}

export default function deleteSaveJobReducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_SAVE_JOB_REQUEST:
      return { ...state, fetching: true, payload: action.payload }
    case DELETE_SAVE_JOB_SUCCESS:
      return { ...state, fetching: false, response: action.payload }
    case DELETE_SAVE_JOB_FAILED:
      return { ...state, fetching: false, error: action.error }
    default:
      return { ...state }
  }
}
