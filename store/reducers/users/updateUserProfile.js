import {
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAILED,
} from 'store/types/users/updateUserProfile'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function updateUserProfile(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_PROFILE_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case UPDATE_USER_PROFILE_FAILED:
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
