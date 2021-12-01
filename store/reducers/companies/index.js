import { combineReducers } from 'redux'

import fetchFeaturedCompaniesReducer from './fetchFeaturedCompanies'

const companiesReducers = combineReducers({
  featuredCompanies: fetchFeaturedCompaniesReducer,
})

export default companiesReducers
