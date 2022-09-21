import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_USER_DETAIL_REQUEST } from 'store/types/users/fetchUserDetail'
import { fetchUserDetailSuccess, fetchUserDetailFailed } from 'store/actions/users/fetchUserDetail'
import { accountSetting } from 'store/services/auth/changeEmail'

function* fetchUserDetailReq(action) {
  try {
    const { data } = yield call(accountSetting, action.payload)
    yield put(fetchUserDetailSuccess(data.data))
  } catch (error) {
    console.log(error)
    yield put(fetchUserDetailFailed(error))
  }
}

export default function* fetchUserDetailSaga() {
  yield takeLatest(FETCH_USER_DETAIL_REQUEST, fetchUserDetailReq)
}
