import {
  MANAGE_USER_LINKS_REQUEST,
  MANAGE_USER_LINKS_SUCCESS,
  MANAGE_USER_LINKS_FAILED
} from 'store/types/users/manageUserLinks'

const initialState = {
  fetching: false,
  response: {},
  error: null
}

export default function manageUserLinks(state = initialState, action) {
  switch (action.type) {
    case MANAGE_USER_LINKS_REQUEST:
      return {
        ...state,
        fetching: true
      }
    case MANAGE_USER_LINKS_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null
      }
    case MANAGE_USER_LINKS_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {}
      }
    default:
      return { ...state }
  }
}