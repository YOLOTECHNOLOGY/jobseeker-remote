import { combineReducers } from 'redux'

import registerUserReducer from './registerUser'
import updateUserCompleteProfileReducer from './updateUserCompleteProfile'
import uploadUserResumeReducer from './uploadUserResume'
import fetchUserOwnDetailReducer from './fetchUserOwnDetail'

const usersReducers = combineReducers({
  registerUser: registerUserReducer,
  updateUserCompleteProfile: updateUserCompleteProfileReducer,
  fetchUserOwnDetail: fetchUserOwnDetailReducer,
  uploadUserResume: uploadUserResumeReducer
})

export default usersReducers
