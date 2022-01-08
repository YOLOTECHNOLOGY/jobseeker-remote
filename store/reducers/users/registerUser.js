import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED,
} from 'store/types/users/registerUser'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function registerUser(state = initialState, action) {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case REGISTER_USER_FAILED:
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
