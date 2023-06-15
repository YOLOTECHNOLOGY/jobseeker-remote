import { call, put, takeLatest, fork } from 'redux-saga/effects'
import { push } from 'connected-next-router'

import { setCookie } from 'helpers/cookies'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'

import { SOCIAL_LOGIN_REQUEST } from 'store/types/auth/socialLogin'

import {
  socialLoginSuccess,
  socialLoginFailed,
} from 'store/actions/auth/socialLogin'
import { socialLoginService } from 'store/services/auth/socialLogin'

function* socialLoginReq(actions) {
  const {
    userId,
    socialType,
    accessToken,
    email,
    redirect,
    firstName,
    lastName,
    pictureUrl,
    activeKey,
  } = actions.payload

  const payload = {
    social_type: socialType,
    user_id: userId,
    token: accessToken,
    email: email,
    first_name: firstName,
    last_name: lastName,
    avatar: pictureUrl,
    source: 'web',
    ...(yield* getUtmCampaignData())
  }

  if (activeKey) {
    payload.active_key = activeKey
  }

  yield fork(login, payload, redirect, true)
}

function* login(payload, redirect, fromRegister = false) {
  try {
    const response = yield call(socialLoginService, payload)

    if (response.status >= 200 && response.status < 300) {
      yield put(socialLoginSuccess(response.data))

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
        is_profile_completed: loginData.is_profile_completed,
      }

      // const redirectUrl = `${process.env.OLD_PROJECT_URL}/dashboard/jobseeker`
      
      // if (getItem(applyPendingJobId)) {
      //   // url = `/dashboard/job/${getItem(applyPendingJobId)}/apply`
      //   redirectUrl = `${process.env.OLD_PROJECT_URL}/dashboard/job/${getItem(applyPendingJobId)}/apply`
      //   yield call(removeItem, applyPendingJobId)
      // } else if (redirect) {
      //   // url = redirect
      //   redirectUrl = redirect
      // }

      removeUtmCampaign()
      
      if (window !== 'undefined' && window.gtag && fromRegister) {
        yield window.gtag('event', 'conversion', {
          send_to: 'AW-844310282/-rRMCKjts6sBEIrOzJID'
        })
      }

      yield call(setCookie, 'user', userCookie)
      yield call(
        setCookie,
        'accessToken',
        loginData.authentication.access_token
      )

      const url =
        loginData.active_key === 1 &&
        (loginData.is_profile_update_required || !loginData.is_profile_completed)
          ? '/jobseeker-complete-profile'
          : `/jobs-hiring/job-search`

      yield put(push(url))
    }
  } catch (err) {
    yield put(socialLoginFailed(err))
  }
}

export default function* socialLoginSaga() {
  yield takeLatest(SOCIAL_LOGIN_REQUEST, socialLoginReq)
}
