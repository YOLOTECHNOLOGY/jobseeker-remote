import { combineReducers } from 'redux'

import socialLoginReducer from './socialLogin'
import loginReducer from './login'
import jobseekersLogin from './jobseekersLogin'

import sendResetPasswordCodeReducer from './sendResetPasswordCode'
import checkResetPasswordCodeReducer from './checkResetPasswordCode'
import resetPasswordReducer from './resetPassword'

import registerJobseekerReducer from './registerJobseeker'
import registerRecruiterReducer from './registerRecruiter'

const authReducers = combineReducers({
  socialLogin: socialLoginReducer,
  login: loginReducer,
  jobseekersLogin: jobseekersLogin,

  sendResetPasswordCode: sendResetPasswordCodeReducer,
  checkResetPasswordCode: checkResetPasswordCodeReducer,
  resetPassword: resetPasswordReducer,

  registerJobseeker: registerJobseekerReducer,
  registerRecruiter: registerRecruiterReducer
})

export default authReducers
