import {
  UPDATE_USER_ONBOARDING_INFO_REQUEST,
  UPDATE_USER_ONBOARDING_INFO_SUCCESS,
  UPDATE_USER_ONBOARDING_INFO_FAILED
} from 'store/types/users/updateUserOnboardingInfo'

const updateUserOnboardingInfoRequest = (payload) => ({
  type: UPDATE_USER_ONBOARDING_INFO_REQUEST,
  payload,
})

const updateUserOnboardingInfoSuccess = (payload) => ({
  type: UPDATE_USER_ONBOARDING_INFO_SUCCESS,
  payload,
})

const updateUserOnboardingInfoFailed = (error) => ({
  type: UPDATE_USER_ONBOARDING_INFO_FAILED,
  error,
})

export { updateUserOnboardingInfoRequest, updateUserOnboardingInfoSuccess, updateUserOnboardingInfoFailed }
