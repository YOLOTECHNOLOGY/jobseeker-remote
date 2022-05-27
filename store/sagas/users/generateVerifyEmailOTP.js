import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { GENERATE_VERIFY_EMAIL_OTP_REQUEST } from 'store/types/users/generateVerifyEmailOTP'

import {
  generateVerifyEmailOTPSuccess,
  generateVerifyEmailOTPFailed,
} from 'store/actions/users/generateVerifyEmailOTP'

import { generateVerifyEmailOTPService } from 'store/services/users/generateVerifyEmailOTP'

function* generateVerifyEmailOTP() {
  try {
    const response = yield call(generateVerifyEmailOTPService)
    if (response.status >= 200 && response.status < 300) {
      yield put(generateVerifyEmailOTPSuccess(response))
    }
  } catch (error) {
    yield put(generateVerifyEmailOTPFailed(error))
  }
}
export default function* generateVerifyEmailOTPSaga() {
  yield takeLatest(GENERATE_VERIFY_EMAIL_OTP_REQUEST, generateVerifyEmailOTP)
}
