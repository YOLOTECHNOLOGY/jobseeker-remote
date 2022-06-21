import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { LOGOUT_REQUEST } from 'store/types/auth/logout'
import { logoutFailed, logoutSuccess } from 'store/actions/auth/logout'
import { logoutService } from 'store/services/auth/logout'
import { getCookie, removeCookie } from 'helpers/cookies'

function* logoutReq() {
  const payload = {
    accessToken: getCookie('accessToken'),
  }

  try {
    const response = yield call(logoutService, payload)
    if (response.status >= 200 && response.status < 300) {
      yield put(logoutSuccess(response.data))
    }
  } catch (err) {
    yield put(logoutFailed(err))
  }

  removeCookie('user')
  removeCookie('accessToken')
  removeCookie('isVerifyEmailModalClosed')

  yield put(push('/'))
}

export default function* logout() {
  yield takeLatest(LOGOUT_REQUEST, logoutReq)
}
