import { put, takeLatest, call } from 'redux-saga/effects'
import { LOGOUT_REQUEST } from 'store/types/auth/logout'
// import { logoutFailed, logoutSuccess } from 'store/actions/auth/logout'
import { logoutService } from 'store/services/auth/logout'
import { removeCookie, getCookie } from 'helpers/cookies'
import { fetchUserOwnDetailClear } from 'store/actions/users/fetchUserOwnDetail'
// import jobseekersLogin from 'store/reducers/auth/jobseekersLogin'
// import jobseekersSocialLogin from 'store/reducers/auth/jobseekersSocialLogin'

function* logoutReq() {
  const accessToken = getCookie('accessToken');
  const payload = {
    source: 'web',
    token: accessToken
  }
  try {
    const response = yield call(logoutService, payload)
    if (response.status >= 200 && response.status < 300) {
    }
  } catch (err) {
    // yield put(logoutFailed(err))
  }

  removeCookie('user')
  removeCookie('accessToken')
  removeCookie('refreshToken')


  yield put(fetchUserOwnDetailClear())

  try {
    import('imforbossjob')
      .then(im => im?.IMManager?.logout?.())
      .then(() => localStorage?.clear?.())

  } catch (e) {
    console.log(e)
  }
  const pathname = window?.location?.pathname
  if (pathname === '/') {
    location?.reload?.()
  } else {
    window?.location?.replace('/')
  }

}

export default function* logout() {
  yield takeLatest(LOGOUT_REQUEST, logoutReq)
}
