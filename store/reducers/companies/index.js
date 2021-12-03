import { combineReducers } from 'redux'

import fetchFeaturedCompaniesReducer from './fetchFeaturedCompanies'
import fetchCompanyDetailReducer from './fetchCompanyDetail'

const companiesReducers = combineReducers({
  featuredCompanies: fetchFeaturedCompaniesReducer,
  companyDetail:fetchCompanyDetailReducer,
})

export default companiesReducers
