import {
  FETCH_COMPANY_DETAIL_REQUEST,
  FETCH_COMPANY_DETAIL_SUCCESS,
  FETCH_COMPANY_DETAIL_FAILED,
} from 'store/types/companies/fetchCompanyDetail'

const fetchCompanyDetailRequest = (payload) => ({
  type: FETCH_COMPANY_DETAIL_REQUEST,
  payload,
})

const fetchCompanyDetailSuccess = (payload) => ({
  type: FETCH_COMPANY_DETAIL_SUCCESS,
  payload,
})

const fetchCompanyDetailFailed = (error) => ({
  type: FETCH_COMPANY_DETAIL_FAILED,
  error,
})

export {
  fetchCompanyDetailRequest,
  fetchCompanyDetailSuccess,
  fetchCompanyDetailFailed,
}
