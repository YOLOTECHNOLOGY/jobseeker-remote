import {
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILED,
} from 'store/types/config/fetchConfig'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchConfig(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONFIG_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_CONFIG_FAILED:
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
