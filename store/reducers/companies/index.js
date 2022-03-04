import { combineReducers } from 'redux'

import fetchFeaturedCompaniesReducer from './fetchFeaturedCompanies'
import fetchCompanyDetailReducer from './fetchCompanyDetail'
import fetchFeaturedCompaniesListReducer from './fetchFeaturedCompaniesList'

const companiesReducers = combineReducers({
  featuredCompanies: fetchFeaturedCompaniesReducer,
  companyDetail:fetchCompanyDetailReducer,
  fetchFeaturedCompaniesList: fetchFeaturedCompaniesListReducer
})

export default companiesReducers
