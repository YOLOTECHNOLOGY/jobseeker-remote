import { put, takeLatest } from 'redux-saga/effects'
import { LOGOUT_REQUEST } from 'store/types/auth/logout'
// import { logoutFailed, logoutSuccess } from 'store/actions/auth/logout'
// import { logoutService } from 'store/services/auth/logout'
import { removeCookie } from 'helpers/cookies'
import { fetchUserOwnDetailClear } from 'store/actions/users/fetchUserOwnDetail'

function* logoutReq() {
  // const payload = {
  //   accessToken: getCookie('accessToken'),
  // }
  // try {
  //   const response = yield call(logoutService, payload)
  //   if (response.status >= 200 && response.status < 300) {
  //   }
  // } catch (err) {
  //   yield put(logoutFailed(err))
  // }

  // yield put(logoutSuccess(response.data))
  removeCookie('user')
  removeCookie('accessToken')
  yield put(fetchUserOwnDetailClear())
  try {
    import('imforbossjob')
      .then(im => im?.IMManager?.logout?.())
      .then(() => localStorage?.clear?.())

  } catch (e) {
    console.log(e)
  }
}

export default function* logout() {
  yield takeLatest(LOGOUT_REQUEST, logoutReq)
}
