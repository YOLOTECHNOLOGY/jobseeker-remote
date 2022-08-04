import {
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAILED,
} from 'store/types/users/updateUserProfile'

const updateUserProfileRequest = (payload) => ({
  type: UPDATE_USER_PROFILE_REQUEST,
  payload,
})

const updateUserProfileSuccess = (payload) => ({
  type: UPDATE_USER_PROFILE_SUCCESS,
  payload,
})

const updateUserProfileFailed = (error) => ({
  type: UPDATE_USER_PROFILE_FAILED,
  error,
})

export {
  updateUserProfileRequest,
  updateUserProfileSuccess,
  updateUserProfileFailed,
}
