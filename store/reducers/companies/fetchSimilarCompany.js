import {
  FETCH_SIMILAR_COMPANY_REQUEST,
  FETCH_SIMILAR_COMPANY_SUCCESS,
  FETCH_SIMILAR_COMPANY_FAILED,
} from 'store/types/companies/fetchSimilarCompany'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchSimilarCompany(state = initialState, action) {
  switch (action.type) {
    case FETCH_SIMILAR_COMPANY_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_SIMILAR_COMPANY_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_SIMILAR_COMPANY_FAILED:
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
