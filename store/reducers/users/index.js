import { combineReducers } from 'redux'

import registerUserReducer from './registerUser'
import updateUserCompleteProfileReducer from './updateUserCompleteProfile'
import uploadUserResumeReducer from './uploadUserResume'
import generateUserResumeReducer from './generateUserResume'
import fetchUserOwnDetailReducer from './fetchUserOwnDetail'
import fetchUserWorkExperienceReducer from './fetchUserWorkExperience'
import fetchUserEducationReducer from './fetchUserEducation'
import completeUserProfileReducer from './completeUserProfile'
import generateVerifyEmailOTPReducer from './generateVerifyEmailOTP'

const usersReducers = combineReducers({
  registerUser: registerUserReducer,
  updateUserCompleteProfile: updateUserCompleteProfileReducer,
  fetchUserOwnDetail: fetchUserOwnDetailReducer,
  uploadUserResume: uploadUserResumeReducer,
  fetchUserWorkExperience: fetchUserWorkExperienceReducer,
  fetchUserEducation: fetchUserEducationReducer,
  generateUserResume: generateUserResumeReducer,
  completeUserProfile: completeUserProfileReducer,
  generateVerifyEmailOTP: generateVerifyEmailOTPReducer,
})

export default usersReducers
