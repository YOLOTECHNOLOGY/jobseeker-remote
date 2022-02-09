import { call, put, takeLatest } from 'redux-saga/effects'
import { SEND_RESET_PASSWORD_CODE_REQUEST } from 'store/types/auth/sendResetPasswordCode'
import {
  sendResetPasswordCodeSuccess,
  sendResetPasswordCodeFailed,
} from 'store/actions/auth/sendResetPasswordCode'
import { sendResetPasswordCodeService } from 'store/services/auth/sendResetPasswordCode'

function* sendResetPasswordCodeReq(actions) {
  try {
    const { email } = actions.payload
    let payload = {
      email
    }
    const response = yield call(sendResetPasswordCodeService, payload)
    if (response.status >= 200 && response.status < 300) {
      yield put(
        sendResetPasswordCodeSuccess(response.data)
      )
    }
  } catch (err) {
    if (err.response.status === 429) {
      alert('Too many attempts. Try again later.')
    }
    yield put(sendResetPasswordCodeFailed(err))
  }
}

export default function* sendResetPasswordCode() {
  yield takeLatest(SEND_RESET_PASSWORD_CODE_REQUEST, sendResetPasswordCodeReq)
}