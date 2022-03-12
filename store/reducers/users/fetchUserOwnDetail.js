import {
  FETCH_USER_OWN_DETAIL_REQUEST,
  FETCH_USER_OWN_DETAIL_SUCCESS,
  FETCH_USER_OWN_DETAIL_FAILED,
} from 'store/types/users/fetchUserOwnDetail'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchUserOwnDetail(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_OWN_DETAIL_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_USER_OWN_DETAIL_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_USER_OWN_DETAIL_FAILED:
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
