import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_APPLIED_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchAppliedJobDetail'
import { fetchAppliedJobDetailSuccess, fetchAppliedJobDetailFailed } from 'store/actions/jobs/fetchAppliedJobDetail'
import { fetchAppliedJobDetailService } from 'store/services/jobs/fetchAppliedJobDetail'

function* fetchAppliedJobDetailReq(action) {
  const { jobId } = action.payload
  try {
    const { data } = yield call(fetchAppliedJobDetailService, jobId)
    yield put(fetchAppliedJobDetailSuccess(data.data))
  } catch (error) {
    console.log('error', error)
    yield put(fetchAppliedJobDetailFailed(error))
  }
}

export default function* fetchAppliedJobDetail() {
  yield takeLatest(FETCH_APPLIED_JOB_DETAIL_REQUEST, fetchAppliedJobDetailReq)
}
