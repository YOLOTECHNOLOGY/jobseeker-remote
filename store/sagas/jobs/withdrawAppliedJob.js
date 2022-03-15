import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { WITHDRAW_APPLIED_JOB_REQUEST } from 'store/types/jobs/withdrawAppliedJob'
import { withdrawAppliedJobSuccess, withdrawAppliedJobFailed } from 'store/actions/jobs/withdrawAppliedJob'
import { withdrawAppliedJobService } from 'store/services/jobs/withdrawAppliedJob'

function* withdrawAppliedJobReq(action) {
  const { appliedJobId, accessToken } = action.payload
  try {
    const { data } = yield call(withdrawAppliedJobService, { appliedJobId, accessToken })
    yield put(withdrawAppliedJobSuccess(data.data))
  } catch (error) {
    console.log('error', error)
    yield put(withdrawAppliedJobFailed(error))
  }
}

export default function* withdrawAppliedJob() {
  yield takeLatest(WITHDRAW_APPLIED_JOB_REQUEST, withdrawAppliedJobReq)
}
