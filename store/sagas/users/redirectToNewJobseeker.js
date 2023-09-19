import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { REDIRECT_TO_NEW_JOBSEEKER_REQUEST } from 'store/types/users/redirectToNewJobseeker'
import { handleUserCookiesConfig, setCookie } from 'helpers/cookies'
import {
  redirectToNewJobseekerSuccess,
  redirectToNewJobseekerFailed
} from 'store/actions/users/redirectToNewJobseeker'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import { loginSuccess } from 'store/actions/auth/login'

function* redirectToNewJobseekerReq(action) {
  const { token, redirectUrl } = action.payload
  try {
    yield call(setCookie, 'accessToken', token)
    const response = yield call(fetchUserOwnDetailService, { accessToken: token })

    if (response.status >= 200 && response.status < 300) {
      yield put(loginSuccess(response.data.data))
      yield put(redirectToNewJobseekerSuccess(response.data.data))

      const loginData = response.data.data
      const userCookie = handleUserCookiesConfig(loginData)

      yield call(setCookie, 'user', userCookie)
      yield put(push(redirectUrl))
    }
  } catch (error) {
    yield put(redirectToNewJobseekerFailed(error))
  }
}

export default function* redirectToNewJobseekerSaga() {
  yield takeLatest(REDIRECT_TO_NEW_JOBSEEKER_REQUEST, redirectToNewJobseekerReq)
}
