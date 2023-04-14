import { call, put, takeLatest } from 'redux-saga/effects'
import { accessToken, refreshToken, setCookie, userKey } from 'helpers/cookies'

import { JOBBSEEKERS_LOGIN_REQUEST } from 'store/types/auth/jobseekersLogin'

import { jobbseekersLoginSuccess, jobbseekersLoginFailed } from 'store/actions/auth/jobseekersLogin'

import { authenticationJobseekersLogin } from 'store/services/auth/jobseekersLogin'
import { checkErrorCode } from 'helpers/errorHandlers'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import * as fbq from 'lib/fpixel'

function* loginReq(actions) {
  try {
    const response = yield call(authenticationJobseekersLogin, actions.payload)

    if (response.status >= 200 && response.status < 300) {
      if (typeof window !== 'undefined' && window.gtag) {
        const data = response.data?.data
        if (data.is_new_account) {
          window.gtag('event', 'sign_up', {
            user_id: data?.id,
            email: data?.email
          })
        }
      }

      yield put(jobbseekersLoginSuccess(response.data))
      const loginData = response.data.data
      const { refresh_token, token, token_expired_at } = loginData
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
        is_profile_completed: loginData.is_profile_completed
      }

      yield call(setCookie, refreshToken, refresh_token)
      yield call(setCookie, userKey, userCookie)
      yield call(setCookie, accessToken, token, token_expired_at)

      // Send register event to FB Pixel (First time login user)
      if (loginData.is_new_account && window !== 'undefined' && window.fbq) {
        yield fbq.event('WebCompleteRegistration', { source: 'web' })
      }
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
        yield put(jobbseekersLoginFailed(errorMessage))
      } else {
        yield put(jobbseekersLoginFailed(err.response))
      }
    }
  }
}

export default function* jobseekersLoginSaga() {
  yield takeLatest(JOBBSEEKERS_LOGIN_REQUEST, loginReq)
}
