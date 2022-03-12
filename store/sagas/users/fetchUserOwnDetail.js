import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_USER_OWN_DETAIL_REQUEST } from 'store/types/users/fetchUserOwnDetail'
import {
  fetchUserOwnDetailSuccess,
  fetchUserOwnDetailFailed,
} from 'store/actions/users/fetchUserOwnDetail'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'

function* fetchUserOwnDetailReq(action) {
  try {
    const { data } = yield call(fetchUserOwnDetailService, action.payload)
    yield put(fetchUserOwnDetailSuccess(data.data))
  } catch (error) {
    console.log(error)
    yield put(fetchUserOwnDetailFailed(error))
  }
}

export default function* fetchUserOwnDetailSaga() {
  yield takeLatest(FETCH_USER_OWN_DETAIL_REQUEST, fetchUserOwnDetailReq)
}
