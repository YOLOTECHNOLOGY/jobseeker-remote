import {
  FETCH_SIMILAR_COMPANY_REQUEST,
  FETCH_SIMILAR_COMPANY_SUCCESS,
  FETCH_SIMILAR_COMPANY_FAILED,
} from 'store/types/companies/fetchSimilarCompany'

const fetchSimilarCompanyRequest = (payload) => ({
  type: FETCH_SIMILAR_COMPANY_REQUEST,
  payload,
})

const fetchSimilarCompanySuccess = (payload) => ({
  type: FETCH_SIMILAR_COMPANY_SUCCESS,
  payload,
})

const fetchSimilarCompanyFailed = (error) => ({
  type: FETCH_SIMILAR_COMPANY_FAILED,
  error,
})

export {
  fetchSimilarCompanyRequest,
  fetchSimilarCompanySuccess,
  fetchSimilarCompanyFailed,
}
