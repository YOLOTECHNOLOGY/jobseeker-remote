import { combineReducers } from 'redux'

import fetchFeaturedCompaniesReducer from './fetchFeaturedCompanies'
import fetchCompanyDetailReducer from './fetchCompanyDetail'
import fetchFeaturedCompaniesListReducer from './fetchFeaturedCompaniesList'
import fetchSimilarCompanyReducer from './fetchSimilarCompany'

const companiesReducers = combineReducers({
  featuredCompanies: fetchFeaturedCompaniesReducer,
  companyDetail:fetchCompanyDetailReducer,
  fetchFeaturedCompaniesList: fetchFeaturedCompaniesListReducer,
  fetchSimilarCompany: fetchSimilarCompanyReducer
})

export default companiesReducers
