import { take, fork, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { setCookie } from 'helpers/cookies'

import { LOGIN_REQUEST } from 'store/types/auth/login'
import { FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS } from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'

import {
  loginSuccess,
  loginFailed,
} from 'store/actions/auth/login'
import { 
  fetchRecruiterSubscriptionFeatureSuccess, 
  fetchRecruiterSubscriptionFeatureFailed 
} from 'store/actions/recruiters/fetchRecruiterSubscriptionFeature'

import { fetchRecruiterSubscriptionFeatureService } from 'store/services/recruiters/fetchRecruiterSubscriptionFeature'
import { loginService } from 'store/services/auth/login'
import { loginToBosshuntService } from 'store/services/auth/loginToBosshunt'

function* loginReq(actions) {
  try {
    const {
      login,
      password,
      redirect,
      applyJobExternalRedirect
    } = actions.payload

    let loginPayload = {
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

      yield fork(fetchRecruiterSubscriptionFeature, loginData, password)
      yield take(FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS)

      // redirect users to complete profile page when users login as jobseeker and require to update their profile or their profile is not completed
      let url =
        loginData.active_key === 1 &&
        (loginData.is_profile_update_required ||
          !loginData.is_profile_completed)
          ? '/jobseeker-complete-profile'
          : '/dashboard'

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

function* fetchRecruiterSubscriptionFeature(user, password) {
  try {
    const subscriptionFeature = yield call(fetchRecruiterSubscriptionFeatureService)

    if (subscriptionFeature.status >= 200 && subscriptionFeature.status < 300) {
      yield put(fetchRecruiterSubscriptionFeatureSuccess(subscriptionFeature.data))

      if (
        user.active_key === 2 &&
        subscriptionFeature.data.data.bosshunt_ats === true
      ) {
        // Login to bosshunt with bossjob account
        const loginBosshuntPayload = {
          email: user.email,
          password: password,
          first_name: user.first_name,
          last_name: user.last_name
        }

        yield fork(logintToBosshunt, loginBosshuntPayload)
      }
    }
    yield call(setCookie, 'splan', subscriptionFeature.data.data)
  } catch (err) {
    yield put(fetchRecruiterSubscriptionFeatureFailed(err))
  }
}

function* logintToBosshunt(payload) {
  try {
    const bosshuntLogin = yield call(loginToBosshuntService, payload)

    if (bosshuntLogin.status >= 200 && bosshuntLogin.status < 300) {
      yield call(setCookie, 'bosshuntAuthToken', bosshuntLogin.data.data.token)
    }
  } catch (err) {
    console.error(err)
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginReq)
}
