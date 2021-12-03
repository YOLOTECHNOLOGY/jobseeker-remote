import {
  FETCH_COMPANY_DETAIL_REQUEST,
  FETCH_COMPANY_DETAIL_SUCCESS,
  FETCH_COMPANY_DETAIL_FAILED,
} from 'store/types/companies/fetchCompanyDetail'

const fetchCompanyDetailRequest = () => ({
  type: FETCH_COMPANY_DETAIL_REQUEST,
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
