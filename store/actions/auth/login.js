import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} from 'store/types/auth/login'

const loginRequest = (payload) => ({
  type: LOGIN_REQUEST,
  payload,
})

const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
})

const loginFailed = (error) => ({
  type: LOGIN_FAILED,
  error,
})

export { loginRequest, loginSuccess, loginFailed }
