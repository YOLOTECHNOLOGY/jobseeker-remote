import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED
} from 'store/types/users/registerUser'

const registerUserRequest = (payload) => ({
  type: REGISTER_USER_REQUEST,
  payload,
})

const registerUserSuccess = (payload) => ({
  type: REGISTER_USER_SUCCESS,
  payload,
})

const registerUserFailed = (error) => ({
  type: REGISTER_USER_FAILED,
  error,
})

export { registerUserRequest, registerUserSuccess, registerUserFailed }
