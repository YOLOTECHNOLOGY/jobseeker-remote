import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { CHECK_VERIFY_EMAIL_OTP_REQUEST } from 'store/types/users/checkVerifyEmailOTP'
import { getCookie, setCookie } from 'helpers/cookies'

import {
  checkVerifyEmailOTPSuccess,
  checkVerifyEmailOTPFailed,
} from 'store/actions/users/checkVerifyEmailOTP'

import { checkVerifyEmailOTPService } from 'store/services/users/checkVerifyEmailOTP'

function* checkVerifyEmailOTP(payload) {
  try {
    const response = yield call(checkVerifyEmailOTPService, payload.payload)
    if (response.status >= 200 && response.status < 300) {
      const user = getCookie('user')
      const userCookie = {
        active_key: user.active_key,
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_num: user.phone_num,
        is_mobile_verified: user.is_mobile_verified,
        avatar: user.avatar,
        additional_info: user.additional_info,
        is_email_verify: true,
        notice_period_id: user.notice_period_id,
        is_profile_completed: user.is_profile_completed,
      }

      yield call(setCookie, 'user', userCookie)
      yield put(checkVerifyEmailOTPSuccess(response))
    }
  } catch (error) {
    yield put(checkVerifyEmailOTPFailed(error))
  }
}
export default function* checkVerifyEmailOTPSaga() {
  yield takeLatest(CHECK_VERIFY_EMAIL_OTP_REQUEST, checkVerifyEmailOTP)
}
