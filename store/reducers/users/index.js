import { combineReducers } from 'redux'

import registerUserReducer from './registerUser'
import updateUserOnboardingInfoReducer from './updateUserOnboardingInfo'
import uploadUserResumeReducer from './uploadUserResume'
import generateUserResumeReducer from './generateUserResume'
import fetchUserOwnDetailReducer from './fetchUserOwnDetail'
import fetchUserWorkExperienceReducer from './fetchUserWorkExperience'
import fetchUserEducationReducer from './fetchUserEducation'
import completeUserProfileReducer from './completeUserProfile'
import updateUserProfileReducer from './updateUserProfile'
import generateVerifyEmailOTPReducer from './generateVerifyEmailOTP'
import checkVerifyEmailOTPReducer from './checkVerifyEmailOTP'
import manageUserWorkExperiencesReducer from './manageUserWorkExperiences'
import manageUserEducationsReducer from './manageUserEducations'
import updateUserPreferencesReducer from './updateUserPreferences'

const usersReducers = combineReducers({
  registerUser: registerUserReducer,
  updateUserOnboardingInfo: updateUserOnboardingInfoReducer,
  fetchUserOwnDetail: fetchUserOwnDetailReducer,
  uploadUserResume: uploadUserResumeReducer,
  fetchUserWorkExperience: fetchUserWorkExperienceReducer,
  fetchUserEducation: fetchUserEducationReducer,
  generateUserResume: generateUserResumeReducer,
  completeUserProfile: completeUserProfileReducer,
  updateUserProfile: updateUserProfileReducer,
  generateVerifyEmailOTP: generateVerifyEmailOTPReducer,
  checkVerifyEmailOTP: checkVerifyEmailOTPReducer,
  manageUserWorkExperiences: manageUserWorkExperiencesReducer,
  manageUserEducations: manageUserEducationsReducer,
  updateUserPreferences: updateUserPreferencesReducer
})

export default usersReducers
