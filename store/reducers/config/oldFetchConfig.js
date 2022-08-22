import {
  OLD_FETCH_CONFIG_REQUEST,
  OLD_FETCH_CONFIG_SUCCESS,
  OLD_FETCH_CONFIG_FAILED,
} from 'store/types/config/oldFetchConfig'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchConfig(state = initialState, action) {
  switch (action.type) {
    case OLD_FETCH_CONFIG_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case OLD_FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case OLD_FETCH_CONFIG_FAILED:
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