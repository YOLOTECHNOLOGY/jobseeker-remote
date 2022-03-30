import {
  FETCH_COMPANY_FILTER_REQUEST,
  FETCH_COMPANY_FILTER_SUCCESS,
  FETCH_COMPANY_FILTER_FAILED,
} from 'store/types/companies/fetchCompanyFilter'

const fetchCompanyFilterRequest = (payload) => ({
  type: FETCH_COMPANY_FILTER_REQUEST,
  payload,
})

const fetchCompanyFilterSuccess = (payload) => ({
  type: FETCH_COMPANY_FILTER_SUCCESS,
  payload,
})

const fetchCompanyFilterFailed = (error) => ({
  type: FETCH_COMPANY_FILTER_FAILED,
  error,
})

export { fetchCompanyFilterRequest, fetchCompanyFilterSuccess, fetchCompanyFilterFailed }
