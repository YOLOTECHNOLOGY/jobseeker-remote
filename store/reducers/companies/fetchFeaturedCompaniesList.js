import errorParser from 'helpers/errorParser'
import {
  FETCH_FEATURED_COMPANIES_LIST_REQUEST,
  FETCH_FEATURED_COMPANIES_LIST_SUCCESS,
  FETCH_FEATURED_COMPANIES_LIST_FAILED,
} from 'store/types/companies/fetchFeaturedCompaniesList'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchFeaturedCompaniesList(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEATURED_COMPANIES_LIST_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_FEATURED_COMPANIES_LIST_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_FEATURED_COMPANIES_LIST_FAILED:
      return {
        ...state,
        fetching: false,
        error: errorParser(action.error) ?? null,
        response: {},
      }
    default:
      return { ...state }
  }
}
