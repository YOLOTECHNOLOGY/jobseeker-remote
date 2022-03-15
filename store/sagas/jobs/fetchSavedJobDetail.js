import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_SAVED_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchSavedJobDetail'
import { fetchSavedJobDetailSuccess, fetchSavedJobDetailFailed } from 'store/actions/jobs/fetchSavedJobDetail'
import { fetchSavedJobDetailService } from 'store/services/jobs/fetchSavedJobDetail'

function* fetchSavedJobDetailReq(action) {
  const { savedJobId, accessToken } = action.payload
  try {
    const { data } = yield call(fetchSavedJobDetailService, { savedJobId, accessToken })
    yield put(fetchSavedJobDetailSuccess(data.data))
  } catch (error) {
    console.log('error', error)
    yield put(fetchSavedJobDetailFailed(error))
  }
}

export default function* fetchSavedJobDetail() {
  yield takeLatest(FETCH_SAVED_JOB_DETAIL_REQUEST, fetchSavedJobDetailReq)
}
