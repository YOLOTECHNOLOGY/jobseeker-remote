import {
  COMPLETE_USER_PROFILE_REQUEST,
  COMPLETE_USER_PROFILE_SUCCESS,
  COMPLETE_USER_PROFILE_FAILED
} from 'store/types/users/completeUserProfile'

const completeUserProfileRequest = (payload) => ({
  type: COMPLETE_USER_PROFILE_REQUEST,
  payload,
})

const completeUserProfileSuccess = (payload) => ({
  type: COMPLETE_USER_PROFILE_SUCCESS,
  payload,
})

const completeUserProfileFailed = (error) => ({
  type: COMPLETE_USER_PROFILE_FAILED,
  error,
})

export { completeUserProfileRequest, completeUserProfileSuccess, completeUserProfileFailed }
