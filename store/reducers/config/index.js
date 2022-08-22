import { combineReducers } from 'redux'

import fetchConfigReducer from './fetchConfig'
import oldFetchConfigReducer from './oldFetchConfig'

const configReducers = combineReducers({
  config: fetchConfigReducer,
  oldConfig: oldFetchConfigReducer
})

export default configReducers
