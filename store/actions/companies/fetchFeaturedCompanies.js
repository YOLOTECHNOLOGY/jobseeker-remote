import {
  FETCH_FEATURED_COMPANIES_REQUEST,
  FETCH_FEATURED_COMPANIES_SUCCESS,
  FETCH_FEATURED_COMPANIES_FAILED,
} from 'store/types/companies/fetchFeaturedCompanies'

const fetchFeaturedCompaniesRequest = () => ({
  type: FETCH_FEATURED_COMPANIES_REQUEST,
})

const fetchFeaturedCompaniesSuccess = (payload) => ({
  type: FETCH_FEATURED_COMPANIES_SUCCESS,
  payload,
})

const fetchFeaturedCompaniesFailed = (error) => ({
  type: FETCH_FEATURED_COMPANIES_FAILED,
  error,
})

export { fetchFeaturedCompaniesRequest, fetchFeaturedCompaniesSuccess, fetchFeaturedCompaniesFailed }
