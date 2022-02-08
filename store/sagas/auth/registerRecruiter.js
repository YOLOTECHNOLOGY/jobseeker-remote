import { take, fork, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'

import { setCookie } from 'helpers/cookies'
import { removeUtmCampaign } from 'helpers/utmCampaign'

import { REGISTER_RECRUITER_REQUEST } from 'store/types/auth/registerRecruiter'
import { FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS } from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'

import {
  registerRecruiterSuccess,
  registerRecruiterFailed,
} from 'store/actions/auth/registerRecruiter'
import { 
  fetchRecruiterSubscriptionFeatureSuccess, 
  fetchRecruiterSubscriptionFeatureFailed 
} from 'store/actions/recruiters/fetchRecruiterSubscriptionFeature'

import { fetchRecruiterSubscriptionFeatureService } from 'store/services/recruiters/fetchRecruiterSubscriptionFeature'
import { registerRecruiterService } from 'store/services/auth/registerRecruiter'
import { loginToBosshuntService } from 'store/services/auth/loginToBosshunt'

function* registerRecruiterReq(actions) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      redirect,
      terms_and_condition
    } = actions.payload

    const registerRecruiterPayload = {
      email,
      first_name,
      last_name,
      password,
      source: 'web',
      country_key: process.env.COUNTRY_KEY,
      terms_and_condition: terms_and_condition,
    }

    const response = yield call(registerRecruiterService, registerRecruiterPayload)
    if (response.status >= 200 && response.status < 300) {
      removeUtmCampaign()
      if (window !== 'undefined' && window.gtag) {
        yield window.gtag('event', 'conversion', {
          send_to: 'AW-844310282/H1MfCNnvqqsBEIrOzJID'
        })
      }
      yield put(registerRecruiterSuccess(response.data))

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
        recruiter_latest_work_xp:
          (registeredData.recruiter_latest_work_xp && {
            company_id: registeredData.recruiter_latest_work_xp.company_id,
            job_title: registeredData.recruiter_latest_work_xp.job_title
          }) ||
          null
      }

      yield call(setCookie, 'user', userCookie)
      yield call(
        setCookie,
        'accessToken',
        registeredData.authentication.access_token
      )

      yield fork(fetchRecruiterSubscriptionFeature)
      yield take(FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS)

      if (
        registeredData.active_key === 2 &&
        process.env.ENV !== 'production'
      ) {
        // Login to bosshunt with bossjob account
        const loginBosshuntPayload = {
          email: registeredData.email,
          password: password,
          first_name: registeredData.first_name,
          last_name: registeredData.last_name
        }

        yield fork(logintToBosshunt, loginBosshuntPayload)
      }

      if (redirect) {
        const locationObj = {
          pathname: '/register/employer/success',
          state: { url: redirect }
        }
        yield put(push(locationObj))
      } else {
        yield put(push('/register/employer/success'))
      }
    }
  } catch (err) {
    yield put(registerRecruiterFailed(err))
  }
}

function* fetchRecruiterSubscriptionFeature() {
  try {
    const subscriptionFeature = yield call(fetchRecruiterSubscriptionFeatureService)

    if (subscriptionFeature.status >= 200 && subscriptionFeature.status < 300) {
      yield put(fetchRecruiterSubscriptionFeatureSuccess(subscriptionFeature.data))
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

export default function* registerRecruiterSaga() {
  yield takeLatest(REGISTER_RECRUITER_REQUEST, registerRecruiterReq)
}
