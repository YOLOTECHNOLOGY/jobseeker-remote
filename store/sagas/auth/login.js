import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { setCookie } from 'helpers/cookies'

import { LOGIN_REQUEST } from 'store/types/auth/login'

import {
  loginSuccess,
  loginFailed,
} from 'store/actions/auth/login'

import { loginService } from 'store/services/auth/login'

function* loginReq(actions) {
  try {
    const {
      login,
      password,
      redirect,
      applyJobExternalRedirect
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
        recruiter_latest_work_xp:
          (loginData.recruiter_latest_work_xp && {
            company_id: loginData.recruiter_latest_work_xp.company_id,
            job_title: loginData.recruiter_latest_work_xp.job_title,
            is_currently_work_here:
              loginData.recruiter_latest_work_xp.is_currently_work_here
          }) ||
          null
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
          ? '/jobseeker-complete-profile'
          : `${process.env.OLD_PROJECT_URL}/dashboard/jobseeker`

      if (redirect && applyJobExternalRedirect) {
        yield put(
          push({
            pathname: redirect,
            state: {
              externalLink: applyJobExternalRedirect
            }
          })
        )
      } else {
        if (redirect) {
          url = redirect
        }
        yield put(push(url))
      }
    }
  } catch (err) {
    yield put(loginFailed(err))
  }
}


export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginReq)
}
