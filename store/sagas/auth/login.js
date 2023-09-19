import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { handleUserCookiesConfig, setCookie } from 'helpers/cookies'

import { LOGIN_REQUEST } from 'store/types/auth/login'

import { authPathToOldProject } from 'helpers/authenticationTransition'

import { loginSuccess, loginFailed } from 'store/actions/auth/login'

import { loginService } from 'store/services/auth/login'
import { checkErrorCode } from 'helpers/errorHandlers'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

function* loginReq(actions) {
  try {
    const { login, password, redirect } = actions.payload

    const loginPayload = {
      login,
      password
    }

    const response = yield call(loginService, loginPayload)

    if (response.status >= 200 && response.status < 300) {
      yield put(loginSuccess(response.data))

      const loginData = response.data.data
      const userCookie = handleUserCookiesConfig(loginData)
      yield call(setCookie, 'user', userCookie)
      yield call(setCookie, 'accessToken', loginData.authentication.access_token)

      // redirect users to complete profile page when users login as jobseeker and require to update their profile or their profile is not completed
      let url =
        loginData.active_key === 1 &&
        (loginData.is_profile_update_required || !loginData.is_profile_completed)
          ? '/jobseeker-complete-profile'
          : `/jobs-hiring/job-search`

      if (redirect) {
        if (
          redirect.includes(process.env.OLD_PROJECT_URL) &&
          !redirect.includes('/jobseeker-login-redirect')
        ) {
          const newUrl = new URL(redirect)

          url = authPathToOldProject(
            loginData.authentication.access_token,
            newUrl.pathname + newUrl.search
          )
        } else {
          url = redirect
        }
      }

      yield put(push(url))
    }
  } catch (err) {
    const isServerError = checkErrorCode(err)
    if (isServerError) {
      yield put(
        displayNotification({
          open: true,
          severity: 'error',
          message:
            'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
        })
      )
    } else {
      const statusCode = err.response.status
      let errorMessage = ''

      if (statusCode === 401 || statusCode === 422) {
        errorMessage = 'invalid credential'
      } else if (statusCode === 403) {
        errorMessage = 'account suspended'
      }

      if (errorMessage) {
        yield put(loginFailed(errorMessage))
      }
    }
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginReq)
}
