import { combineReducers } from 'redux'

import setUserDeviceReducer from './setUserDevice'
import setRemoteIpReducer from './setRemoteIp'

const utilityReducers = combineReducers({
  userDevice: setUserDeviceReducer,
  setRemoteIp: setRemoteIpReducer,
})

export default utilityReducers
