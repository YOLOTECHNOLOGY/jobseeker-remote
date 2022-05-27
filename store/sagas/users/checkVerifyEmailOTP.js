import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { CHECK_VERIFY_EMAIL_OTP_REQUEST } from 'store/types/users/checkVerifyEmailOTP'

import {
  checkVerifyEmailOTPSuccess,
  checkVerifyEmailOTPFailed,
} from 'store/actions/users/checkVerifyEmailOTP'

import { checkVerifyEmailOTPService } from 'store/services/users/checkVerifyEmailOTP'

function* checkVerifyEmailOTP(payload) {
  try {
    console.log({ payload })
    const response = yield call(checkVerifyEmailOTPService, payload.payload)
    console.log({ response })
    if (response.status >= 200 && response.status < 300) {
      yield put(checkVerifyEmailOTPSuccess(response))
    }
  } catch (error) {
    yield put(checkVerifyEmailOTPFailed(error))
  }
}
export default function* checkVerifyEmailOTPSaga() {
  console.log('watcher')
  yield takeLatest(CHECK_VERIFY_EMAIL_OTP_REQUEST, checkVerifyEmailOTP)
}
