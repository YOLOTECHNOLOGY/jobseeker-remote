import { call, put, takeLatest, fork } from 'redux-saga/effects'
import { setCookie } from 'helpers/cookies'

import { SOCIAL_LOGIN_REQUEST } from 'store/types/auth/socialLogin'
import {
  socialLoginSuccess,
  socialLoginFailed,
} from 'store/actions/auth/socialLogin'

import { socialLoginService } from 'store/services/auth/socialLogin'
import { checkEmailExistService } from 'store/services/auth/checkEmailExist'
import { checkSocialUserExistService } from 'store/services/auth/checkSocialUserExist'

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

  let payload = {
    social_type: socialType,
    user_id: userId,
    token: accessToken,
    email: email,
    first_name: firstName,
    last_name: lastName,
    avatar: pictureUrl,
    source: 'web',
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
        active_key: response.data.data.active_key,
        id: response.data.data.id,
        first_name: response.data.data.first_name,
        last_name: response.data.data.last_name,
        email: response.data.data.email,
        phone_num: response.data.data.phone_num,
        is_mobile_verified: response.data.data.is_mobile_verified,
        avatar: response.data.data.avatar,
        additional_info: response.data.data.additional_info,
        is_email_verify: response.data.data.is_email_verify,
        notice_period_id: response.data.data.notice_period_id,
        is_profile_completed: response.data.data.is_profile_completed,
        recruiter_latest_work_xp:
          (response.data.data.recruiter_latest_work_xp && {
            company_id: response.data.data.recruiter_latest_work_xp.company_id,
            job_title: response.data.data.recruiter_latest_work_xp.job_title
          }) ||
          null
      }

      let url = '/dashboard'

      if (getItem(applyPendingJobId)) {
        url = `/dashboard/job/${getItem(applyPendingJobId)}/apply`
        yield call(removeItem, applyPendingJobId)
      } else if (redirect) {
        url = redirect
      }

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
        response.data.data.authentication.access_token
      )
    }
  } catch (err) {
    yield put(socialLoginFailed(error))
  }
}

function* checkSocialUserExist(payload, redirect) {
  try {
    const response = yield call(checkSocialUserExistService, {
      social_type: payload.socialType,
      user_id: payload.userId
    })

    const emailExistResponse = yield call(
      checkEmailExistService,
      payload.email
    )

    if (
      emailExistResponse.data.data.email &&
      response.status >= 200 &&
      response.status < 300
    ) {
      let loginPayload = {
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
