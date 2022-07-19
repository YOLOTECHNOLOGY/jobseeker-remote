import { take, fork, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import * as fbq from 'lib/fpixel'

import { setCookie } from 'helpers/cookies'
import { setItem } from 'helpers/localStorage'
import { isFromCreateResume } from 'helpers/constants'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'
import { authPathToOldProject } from 'helpers/authenticationTransition'

import { REGISTER_JOBSEEKER_REQUEST } from 'store/types/auth/registerJobseeker'

import {
  registerJobseekerSuccess,
  registerJobseekerFailed,
} from 'store/actions/auth/registerJobseeker'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import { registerJobseekerService } from 'store/services/auth/registerJobseeker'
import { checkErrorCode } from 'helpers/errorHandlers'

function* registerJobSeekerReq(actions) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      terms_and_condition,
      is_subscribe,
      source,
      redirect,
    } = actions.payload

    let randomPassword
    if (source === 'free_resume') {
      randomPassword =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    const registerJobseekerPayload = {
      email,
      first_name,
      last_name,
      password: password || '12345678',
      is_subscribe: is_subscribe || 0,
      source: source || 'web',
      country_key: process.env.COUNTRY_KEY,
      terms_and_condition: terms_and_condition || 0,
      ...(yield* getUtmCampaignData()),
    }

    const response = yield call(registerJobseekerService, registerJobseekerPayload)
    if (response.status >= 200 && response.status < 300) {
      removeUtmCampaign()
      yield put(registerJobseekerSuccess(response.data))

      if (window !== 'undefined' && window.gtag) {
        yield window.gtag('event', 'conversion', {
          send_to: 'AW-844310282/-rRMCKjts6sBEIrOzJID',
        })
      }

      if (window !== 'undefined' && window.fbq) {
        yield fbq.event('CompleteRegistration', {'source': 'sign_up'})
      }

      const registeredData = response.data.data
      const userCookie = {
        active_key: registeredData.active_key,
        id: registeredData.id,
        first_name: registeredData.first_name,
        last_name: registeredData.last_name,
        email: registeredData.email,
        phone_num: registeredData.phone_num,
        is_mobile_verified: registeredData.is_mobile_verified,
        avatar: registeredData.avatar,
        additional_info: registeredData.additional_info,
        is_email_verify: registeredData.is_email_verify,
        notice_period_id: registeredData.notice_period_id,
        is_profile_completed: registeredData.is_profile_completed,
      }
      setItem(isFromCreateResume, source === 'free_resume' ? '1' : '0')

      yield call(setCookie, 'user', userCookie)
      yield call(setCookie, 'accessToken', registeredData.authentication.access_token)

      let url = '/jobseeker-complete-profile/1'

      if (redirect) {
        if (redirect.includes(process.env.OLD_PROJECT_URL) && !redirect.includes('/jobseeker-login-redirect')) {
          const newUrl = new URL(redirect)

          url = authPathToOldProject(
            registeredData.authentication.access_token,
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
      yield put(displayNotification({
        open: true,
        severity: 'error',
        message: 'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
      }))
    } else {
      const statusCode = err.response.status
      if (statusCode === 422) {
        let errorMessage = ''
        const error = err.response.data.errors.message
        if (error) {
          if (error['email']) {
            if (error['email'][0] === 'The email has already been taken.') {
              errorMessage = 'The email has already been taken.'
            }
          }
        }
        yield put(registerJobseekerFailed(errorMessage))
      }
    }
  }
}

export default function* registerJobseekerSaga() {
  yield takeLatest(REGISTER_JOBSEEKER_REQUEST, registerJobSeekerReq)
}
