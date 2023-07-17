import { put, takeLatest } from 'redux-saga/effects'
import { LOGOUT_REQUEST } from 'store/types/auth/logout'
// import { logoutFailed, logoutSuccess } from 'store/actions/auth/logout'
import { logoutService } from 'store/services/auth/logout'
import { removeCookie } from 'helpers/cookies'
import { fetchUserOwnDetailClear } from 'store/actions/users/fetchUserOwnDetail'
import jobseekersLogin from 'store/reducers/auth/jobseekersLogin'
import jobseekersSocialLogin from 'store/reducers/auth/jobseekersSocialLogin'

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
  removeCookie('refreshToken')
  yield put(fetchUserOwnDetailClear())
  yield put(jobseekersSocialLogin({
    type: JOBBSEEKERS_SOCIALLOGIN_CLEAR,
  }))
  yield put(jobseekersLogin({
    type: JOBBSEEKERS_LOGIN_CLEAR,
  }))
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
