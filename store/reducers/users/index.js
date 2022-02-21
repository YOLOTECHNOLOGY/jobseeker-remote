import { combineReducers } from 'redux'

import registerUserReducer from './registerUser'
import updateUserCompleteProfileReducer from './updateUserCompleteProfile'
import uploadUserResumeReducer from './uploadUserResume'
import fetchUserOwnDetailReducer from './fetchUserOwnDetail'
import fetchUserWorkExperienceReducer from './fetchUserWorkExperience'

const usersReducers = combineReducers({
  registerUser: registerUserReducer,
  updateUserCompleteProfile: updateUserCompleteProfileReducer,
  fetchUserOwnDetail: fetchUserOwnDetailReducer,
  uploadUserResume: uploadUserResumeReducer,
  fetchUserWorkExperience: fetchUserWorkExperienceReducer
})

export default usersReducers
