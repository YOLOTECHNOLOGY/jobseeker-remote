import { combineReducers } from 'redux'

import socialLoginReducer from './socialLogin'
import loginReducer from './login'

const authReducers = combineReducers({
  socialLogin: socialLoginReducer,
  login: loginReducer
})

export default authReducers
