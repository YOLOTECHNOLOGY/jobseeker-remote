import {
  FETCH_COMPANY_FILTER_REQUEST,
  FETCH_COMPANY_FILTER_SUCCESS,
  FETCH_COMPANY_FILTER_FAILED,
} from 'store/types/companies/fetchCompanyFilter'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchCompanyFilter(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMPANY_FILTER_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_COMPANY_FILTER_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_COMPANY_FILTER_FAILED:
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
