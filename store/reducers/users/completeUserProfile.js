import {
  COMPLETE_USER_PROFILE_REQUEST,
  COMPLETE_USER_PROFILE_SUCCESS,
  COMPLETE_USER_PROFILE_FAILED,
} from 'store/types/users/completeUserProfile'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function completeUserProfile(state = initialState, action) {
  switch (action.type) {
    case COMPLETE_USER_PROFILE_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case COMPLETE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case COMPLETE_USER_PROFILE_FAILED:
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
