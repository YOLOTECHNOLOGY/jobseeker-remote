import { combineReducers } from 'redux'

import setUserDeviceReducer from './setUserDevice'

const utilityReducers = combineReducers({
  userDevice: setUserDeviceReducer,
})

export default utilityReducers
