import { combineReducers } from 'redux'

import fetchFeaturedCompaniesReducer from './fetchFeaturedCompanies'
import fetchCompanyDetailReducer from './fetchCompanyDetail'
import fetchFeaturedCompaniesListReducer from './fetchFeaturedCompaniesList'
import fetchSimilarCompanyReducer from './fetchSimilarCompany'
import fetchCompanySuggestionsReducer from './fetchCompanySuggestions'
import fetchCompanyFilterReducer from './fetchCompanyFilter'

const companiesReducers = combineReducers({
  featuredCompanies: fetchFeaturedCompaniesReducer,
  companyDetail:fetchCompanyDetailReducer,
  fetchFeaturedCompaniesList: fetchFeaturedCompaniesListReducer,
  fetchSimilarCompany: fetchSimilarCompanyReducer,
  fetchCompanySuggestions: fetchCompanySuggestionsReducer,
  fetchCompanyFilter: fetchCompanyFilterReducer
})

export default companiesReducers
