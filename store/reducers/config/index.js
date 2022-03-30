import { combineReducers } from 'redux'

import fetchConfigReducer from './fetchConfig'

const configReducers = combineReducers({
  config: fetchConfigReducer,
})

export default configReducers
