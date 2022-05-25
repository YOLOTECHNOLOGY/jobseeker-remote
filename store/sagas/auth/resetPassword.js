import { call, put, takeLatest, fork, take } from 'redux-saga/effects'
import { push } from 'connected-next-router'

import { RESET_PASSWORD_REQUEST } from 'store/types/auth/resetPassword'

import {
  resetPasswordSuccess,
  resetPasswordFailed,
} from 'store/actions/auth/resetPassword'

import { resetPasswordService } from 'store/services/auth/resetPassword'

function* resetPasswordReq(actions) {
  try {
    const { password, email, otp } = actions.payload

    const payload = {
      new_password: password,
      otp,
      email
    }
    const response = yield call(resetPasswordService, payload)

    if (response.status >= 200 && response.status < 300) {
      yield put(
        resetPasswordSuccess(response.data)
      )

      yield put(push('/change-password/success'))
    }
  } catch (err) {
    yield put(resetPasswordFailed(err))
  }
}

export default function* resetPassword() {
  yield takeLatest(RESET_PASSWORD_REQUEST, resetPasswordReq)
}