import { combineReducers } from 'redux'

import socialLoginReducer from './socialLogin'
import loginReducer from './login'

import sendResetPasswordCodeReducer from './sendResetPasswordCode'
import checkResetPasswordCodeReducer from './checkResetPasswordCode'
import resetPasswordReducer from './resetPassword'

const authReducers = combineReducers({
  socialLogin: socialLoginReducer,
  login: loginReducer,

  sendResetPasswordCode: sendResetPasswordCodeReducer,
  checkResetPasswordCode: checkResetPasswordCodeReducer,
  resetPassword: resetPasswordReducer
})

export default authReducers
