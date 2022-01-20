import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_APPLIED_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchAppliedJobDetail'
import { fetchAppliedJobDetailSuccess, fetchAppliedJobDetailFailed } from 'store/actions/jobs/fetchAppliedJobDetail'
import { fetchAppliedJobDetailService } from 'store/services/jobs/fetchAppliedJobDetail'

function* fetchAppliedJobDetailReq(action) {
  try {
    const payload = {
      appliedJobId: action.payload,
    }

    const response = yield call(fetchAppliedJobDetailService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchAppliedJobDetailSuccess(response.data.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(fetchAppliedJobDetailFailed(error))
  }
}

export default function* fetchAppliedJobDetail() {
  yield takeLatest(FETCH_APPLIED_JOB_DETAIL_REQUEST, fetchAppliedJobDetailReq)
}
