import {
  FETCH_FEATURED_COMPANIES_REQUEST,
  FETCH_FEATURED_COMPANIES_SUCCESS,
  FETCH_FEATURED_COMPANIES_FAILED,
} from 'store/types/companies/fetchFeaturedCompanies'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchFeaturedCompanies(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEATURED_COMPANIES_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_FEATURED_COMPANIES_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_FEATURED_COMPANIES_FAILED:
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
