import {
  FETCH_FEATURED_COMPANIES_LIST_REQUEST,
  FETCH_FEATURED_COMPANIES_LIST_SUCCESS,
  FETCH_FEATURED_COMPANIES_LIST_FAILED,
} from 'store/types/companies/fetchFeaturedCompaniesList'

const fetchFeaturedCompaniesListRequest = () => ({
  type: FETCH_FEATURED_COMPANIES_LIST_REQUEST,
})

const fetchFeaturedCompaniesListSuccess = (payload) => ({
  type: FETCH_FEATURED_COMPANIES_LIST_SUCCESS,
  payload,
})

const fetchFeaturedCompaniesListFailed = (error) => ({
  type: FETCH_FEATURED_COMPANIES_LIST_FAILED,
  error,
})

export { fetchFeaturedCompaniesListRequest, fetchFeaturedCompaniesListSuccess, fetchFeaturedCompaniesListFailed }
