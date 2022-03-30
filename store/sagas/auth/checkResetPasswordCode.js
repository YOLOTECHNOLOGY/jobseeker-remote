import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'

import { CHECK_RESET_PASSWORD_CODE_REQUEST } from 'store/types/auth/checkResetPasswordCode'
import {
  checkResetPasswordCodeSuccess,
  checkResetPasswordCodeFailed,
} from 'store/actions/auth/checkResetPasswordCode'
import { checkResetPasswordCodeService } from 'store/services/auth/checkResetPasswordCode'

function* checkResetPasswordCodeReq(actions) {
  try {
    const { email, otp } = actions.payload
    const response = yield call(checkResetPasswordCodeService, { email, otp })

    if (response.status >= 200 && response.status < 300) {
      yield put(checkResetPasswordCodeSuccess(response.data))
      yield put(push(`/change-password?email=${email}&otp=${otp}`))
    }
  } catch (err) {
    yield put(checkResetPasswordCodeFailed(err))
  }
}

export default function* checkResetPasswordCode() {
  yield takeLatest(CHECK_RESET_PASSWORD_CODE_REQUEST, checkResetPasswordCodeReq)
}