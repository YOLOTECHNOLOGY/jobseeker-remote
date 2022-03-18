import {
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED
} from 'store/types/auth/logout'

const logoutRequest = (payload) => ({
  type: LOGOUT_REQUEST,
})

const logoutSuccess = (payload) => ({
  type: LOGOUT_SUCCESS,
  payload,
})

const logoutFailed = (error) => ({
  type: LOGOUT_FAILED,
  error,
})

export { logoutRequest, logoutSuccess, logoutFailed }
