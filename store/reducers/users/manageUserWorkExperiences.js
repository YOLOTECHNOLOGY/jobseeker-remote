import {
  MANAGE_USER_WORK_EXPERIENCES_REQUEST,
  MANAGE_USER_WORK_EXPERIENCES_SUCCESS,
  MANAGE_USER_WORK_EXPERIENCES_FAILED,
} from 'store/types/users/manageUserWorkExperiences'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function manageUserWorkExperiences(state = initialState, action) {
  switch (action.type) {
    case MANAGE_USER_WORK_EXPERIENCES_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case MANAGE_USER_WORK_EXPERIENCES_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case MANAGE_USER_WORK_EXPERIENCES_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {},
      }
    default:
      return { ...state }
  }
}
