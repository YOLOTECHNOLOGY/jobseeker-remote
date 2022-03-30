import { combineReducers } from 'redux'

import fetchRecruiterSubscriptionFeatureReducer from './fetchRecruiterSubscriptionFeature'

const recruitersReducers = combineReducers({
  fetchRecruiterSubscriptionFeature: fetchRecruiterSubscriptionFeatureReducer,
})

export default recruitersReducers
