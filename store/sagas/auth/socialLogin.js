import { call, put, takeLatest, fork } from 'redux-saga/effects'
import { push } from 'connected-next-router'

import { setCookie } from 'helpers/cookies'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'
import { getItem, removeItem } from 'helpers/localStorage'
import { applyPendingJobId } from 'helpers/constants'
import { authPathToOldProject } from 'helpers/authenticationTransition'

import { SOCIAL_LOGIN_REQUEST } from 'store/types/auth/socialLogin'

import {
  socialLoginSuccess,
  socialLoginFailed,
} from 'store/actions/auth/socialLogin'
import { socialLoginService } from 'store/services/auth/socialLogin'
import { checkEmailExistService } from 'store/services/auth/checkEmailExist'

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
    isLogin
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

  if (isLogin) {
    // if user is trying to login, check account existance first
    yield fork(checkSocialUserExist, actions.payload, redirect)
  } else {
    // if user is registering, can call /social_login api right away -> checking will be done in backend
    yield fork(login, payload, redirect, true)
  }
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

      // let url = '/dashboard'
      let redirectUrl = `${process.env.OLD_PROJECT_URL}/dashboard/jobseeker`
      
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
        if (parseInt(userCookie.active_key) === 1) {
          yield window.gtag('event', 'conversion', {
            send_to: 'AW-844310282/-rRMCKjts6sBEIrOzJID'
          })
        } else {
          yield window.gtag('event', 'conversion', {
            send_to: 'AW-844310282/H1MfCNnvqqsBEIrOzJID'
          })
        }
      }

      yield call(setCookie, 'user', userCookie)
      yield call(
        setCookie,
        'accessToken',
        loginData.authentication.access_token
      )

      const path = authPathToOldProject(loginData.authentication.access_token, redirectUrl)
      console.log('path: ', path)
      let url =
        loginData.active_key === 1 &&
        (loginData.is_profile_update_required || !loginData.is_profile_completed)
          ? '/jobseeker-complete-profile/1'
          : `/jobs-hiring/job-search`

      yield put(push(url))
      // yield put(destroy('companyJobForm')) // Reset Jobs Form
    }
  } catch (err) {
    yield put(socialLoginFailed(err))
  }
}

function* checkSocialUserExist(payload, redirect) {
  try {
    const emailExistResponse = yield call(
      checkEmailExistService,
      payload.email
    )

    if (
      emailExistResponse.data.data.email &&
      response.status >= 200 &&
      response.status < 300
    ) {
      const loginPayload = {
        social_type: payload.socialType,
        user_id: payload.userId,
        token: payload.accessToken,
        email: payload.email,
        first_name: payload.firstName,
        last_name: payload.lastName,
        avatar: payload.pictureUrl,
        source: 'web'
      }

      if (payload.activeKey) {
        loginPayload.active_key = payload.activeKey
      }

      yield fork(login, loginPayload, redirect)
    }
  } catch (err) {
    console.error(err)
  }
}

export default function* socialLoginSaga() {
  yield takeLatest(SOCIAL_LOGIN_REQUEST, socialLoginReq)
}
