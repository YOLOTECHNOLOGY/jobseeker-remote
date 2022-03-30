import {
  FETCH_COMPANY_DETAIL_REQUEST,
  FETCH_COMPANY_DETAIL_SUCCESS,
  FETCH_COMPANY_DETAIL_FAILED,
} from 'store/types/companies/fetchCompanyDetail'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchCompanyDetail(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMPANY_DETAIL_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_COMPANY_DETAIL_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_COMPANY_DETAIL_FAILED:
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
