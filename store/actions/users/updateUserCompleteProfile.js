import {
  UPDATE_USER_COMPLETE_PROFILE_REQUEST,
  UPDATE_USER_COMPLETE_PROFILE_SUCCESS,
  UPDATE_USER_COMPLETE_PROFILE_FAILED
} from 'store/types/users/updateUserCompleteProfile'

const updateUserCompleteProfileRequest = (payload) => ({
  type: UPDATE_USER_COMPLETE_PROFILE_REQUEST,
  payload,
})

const updateUserCompleteProfileSuccess = (payload) => ({
  type: UPDATE_USER_COMPLETE_PROFILE_SUCCESS,
  payload,
})

const updateUserCompleteProfileFailed = (error) => ({
  type: UPDATE_USER_COMPLETE_PROFILE_FAILED,
  error,
})

export { updateUserCompleteProfileRequest, updateUserCompleteProfileSuccess, updateUserCompleteProfileFailed }
