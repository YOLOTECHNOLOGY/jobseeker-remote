import {
  FETCH_COMPANY_SUGGESTIONS_REQUEST,
  FETCH_COMPANY_SUGGESTIONS_SUCCESS,
  FETCH_COMPANY_SUGGESTIONS_FAILED,
} from 'store/types/companies/fetchCompanySuggestions'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchCompanySuggestions(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMPANY_SUGGESTIONS_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_COMPANY_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_COMPANY_SUGGESTIONS_FAILED:
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
