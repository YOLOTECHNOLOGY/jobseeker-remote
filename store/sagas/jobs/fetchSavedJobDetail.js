import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_SAVED_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchSavedJobDetail'
import { fetchSavedJobDetailSuccess, fetchSavedJobDetailFailed } from 'store/actions/jobs/fetchSavedJobDetail'
import { fetchSavedJobDetailService } from 'store/services/jobs/fetchSavedJobDetail'

function* fetchSavedJobDetailReq(action) {
  const { jobId } = action.payload
  try {
    const { data } = yield call(fetchSavedJobDetailService, jobId)
    yield put(fetchSavedJobDetailSuccess(data.data))
  } catch (error) {
    yield put(fetchSavedJobDetailFailed(error))
  }
}

export default function* fetchSavedJobDetail() {
  yield takeLatest(FETCH_SAVED_JOB_DETAIL_REQUEST, fetchSavedJobDetailReq)
}
