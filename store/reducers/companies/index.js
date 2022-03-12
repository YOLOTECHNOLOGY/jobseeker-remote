import { combineReducers } from 'redux'

import fetchFeaturedCompaniesReducer from './fetchFeaturedCompanies'
import fetchCompanyDetailReducer from './fetchCompanyDetail'
import fetchFeaturedCompaniesListReducer from './fetchFeaturedCompaniesList'
import fetchCompanySuggestionsReducer from './fetchCompanySuggestions'
import fetchCompanyFilterReducer from './fetchCompanyFilter'

const companiesReducers = combineReducers({
  featuredCompanies: fetchFeaturedCompaniesReducer,
  companyDetail:fetchCompanyDetailReducer,
  fetchFeaturedCompaniesList: fetchFeaturedCompaniesListReducer,
  fetchCompanySuggestions: fetchCompanySuggestionsReducer,
  fetchCompanyFilter: fetchCompanyFilterReducer
})

export default companiesReducers
