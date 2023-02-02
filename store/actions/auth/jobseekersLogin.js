import {
  JOBBSEEKERS_LOGIN_REQUEST,
  JOBBSEEKERS_LOGIN_SUCCESS,
  JOBBSEEKERS_LOGIN_FAILED
} from 'store/types/auth/jobseekersLogin'

const jobbseekersLoginRequest = (payload) => ({
  type: JOBBSEEKERS_LOGIN_REQUEST,
  payload
})

const jobbseekersLoginSuccess = (payload) => ({
  type: JOBBSEEKERS_LOGIN_SUCCESS,
  payload
})

const jobbseekersLoginFailed = (error) => ({
  type: JOBBSEEKERS_LOGIN_FAILED,
  error
})

export { jobbseekersLoginRequest, jobbseekersLoginSuccess, jobbseekersLoginFailed }
