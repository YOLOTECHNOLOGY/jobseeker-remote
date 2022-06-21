import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { setCookie } from 'helpers/cookies'

import { LOGIN_REQUEST } from 'store/types/auth/login'

import {
  loginSuccess,
  loginFailed,
} from 'store/actions/auth/login'
import {
  displayNotification
} from 'store/actions/notificationBar/notificationBar'

import { loginService } from 'store/services/auth/login'

function* loginReq(actions) {
  try {
    const {
      login,
      password,
      redirect,
    } = actions.payload

    const loginPayload = {
      login,
      password
    }

    const response = yield call(loginService, loginPayload)

    if (response.status >= 200 && response.status < 300) {
      yield put(loginSuccess(response.data))

      const loginData = response.data.data

      const userCookie = {
        active_key: loginData.active_key,
        id: loginData.id,
        first_name: loginData.first_name,
        last_name: loginData.last_name,
        email: loginData.email,
        phone_num: loginData.phone_num,
        is_mobile_verified: loginData.is_mobile_verified,
        avatar: loginData.avatar,
        additional_info: loginData.additional_info,
        is_email_verify: loginData.is_email_verify,
        notice_period_id: loginData.notice_period_id,
        is_bosshunt_talent: loginData.is_bosshunt_talent,
        is_bosshunt_talent_active: loginData.is_bosshunt_talent_active,
        bosshunt_talent_opt_out_at: loginData.bosshunt_talent_opt_out_at,
        is_profile_completed: loginData.is_profile_completed,
      }

      yield call(setCookie, 'user', userCookie)
      yield call(
        setCookie,
        'accessToken',
        loginData.authentication.access_token
      )

      // redirect users to complete profile page when users login as jobseeker and require to update their profile or their profile is not completed
      let url =
        loginData.active_key === 1 &&
        (loginData.is_profile_update_required || !loginData.is_profile_completed)
          ? '/jobseeker-complete-profile/1'
          : `/jobs-hiring/job-search`
      
      if (redirect) {
        if (redirect.includes(process.env.OLD_PROJECT_URL)) {
          let redirectUrl = redirect
          const delimiter = '/jobseeker-login-redirect?redirectUrl='
          const redirectArray = redirect.split(delimiter)
          if (redirectArray.length === 2) {
            const queryParam = redirectArray[1]
            const encodedQueryParam = encodeURIComponent(queryParam)
            let encodedRedirect = ''
            encodedRedirect.concat(redirectArray[0], delimiter, encodedQueryParam)
            redirectUrl = redirectArray[0] + delimiter + encodedQueryParam
          }

          url = `${redirectUrl}&token=${loginData.authentication.access_token}`
        } else {
          url = redirect
        }
      }
      
      yield put(push(url))
    }
  } catch (err) {
    const statusCode = err.response.status

    let errorMessage = ''

    if (statusCode === 401 || statusCode === 422 ) {
      errorMessage = 'invalid credential'
    } else if (statusCode === 403) {
      errorMessage = 'account suspended'
    }

    if (errorMessage) {
      yield put(loginFailed(errorMessage))
    } else {
      const displayNotificationPayload = {
        "open": true,
        "severity": "error",
        "message": "We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance."
      }
      yield put(displayNotification(displayNotificationPayload))
    }
  }
}


export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginReq)
}
