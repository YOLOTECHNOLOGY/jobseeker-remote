import { call, put, takeLatest } from 'redux-saga/effects'
import { CHECK_VERIFY_EMAIL_OTP_REQUEST } from 'store/types/users/checkVerifyEmailOTP'
import { getCookie, handleUserCookiesConfig, setCookie } from 'helpers/cookies'

import {
  checkVerifyEmailOTPSuccess,
  checkVerifyEmailOTPFailed
} from 'store/actions/users/checkVerifyEmailOTP'

import { checkVerifyEmailOTPService } from 'store/services/users/checkVerifyEmailOTP'

function* checkVerifyEmailOTP(payload) {
  try {
    const response = yield call(checkVerifyEmailOTPService, payload.payload)
    if (response.status >= 200 && response.status < 300) {
      const user = getCookie('user')
      const userCookie = handleUserCookiesConfig(user)
      yield call(setCookie, 'user', { ...userCookie, is_email_verify: true })
      yield put(checkVerifyEmailOTPSuccess(response))
    }
  } catch (error) {
    yield put(checkVerifyEmailOTPFailed(error))
  }
}
export default function* checkVerifyEmailOTPSaga() {
  yield takeLatest(CHECK_VERIFY_EMAIL_OTP_REQUEST, checkVerifyEmailOTP)
}
