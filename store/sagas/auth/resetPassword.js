import { call, put, takeLatest, fork } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { setCookie } from 'helpers/cookies'

import { RESET_PASSWORD_REQUEST } from 'store/types/auth/resetPassword'
import { FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS } from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'

import {
  resetPasswordSuccess,
  resetPasswordFailed,
} from 'store/actions/auth/resetPassword'
import { 
  fetchRecruiterSubscriptionFeatureSuccess, 
  fetchRecruiterSubscriptionFeatureFailed 
} from 'store/actions/recruiters/fetchRecruiterSubscriptionFeature'

import { resetPasswordService } from 'store/services/auth/resetPassword'
import { fetchRecruiterSubscriptionFeatureService } from 'store/services/recruiters/fetchRecruiterSubscriptionFeature'

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

function* resetPasswordReq(actions) {
  console.log('resetPassword: ', actions)
  try {
    const { password, login, otp } = actions.payload

    const payload = {
      new_password: password,
      otp: otp,
      email: login
    }
    const response = yield call(resetPasswordService, payload)

    if (response.status >= 200 && response.status < 300) {
      yield put(
        resetPasswordSuccess(response.data)
      )

      yield call(
        setCookie,
        'accessToken',
        response.data.data.authentication.access_token
      )

      yield fork(fetchRecruiterSubscriptionFeature)
      yield take(FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS)
      yield put(push('/change-password-success'))
    }
  } catch (err) {
    console.log(err)
    yield put(resetPasswordFailed(err))
  }
}

export default function* resetPassword() {
  yield takeLatest(RESET_PASSWORD_REQUEST, resetPasswordReq)
}