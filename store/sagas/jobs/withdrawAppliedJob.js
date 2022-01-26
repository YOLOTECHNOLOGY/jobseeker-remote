import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { WITHDRAW_APPLIED_JOB_REQUEST } from 'store/types/jobs/withdrawAppliedJob'
import { withdrawAppliedJobSuccess, withdrawAppliedJobFailed } from 'store/actions/jobs/withdrawAppliedJob'
import { withdrawAppliedJobService } from 'store/services/jobs/withdrawAppliedJob'

function* withdrawAppliedJobReq(action) {
  console.log('action', action)
  try {
    const payload = {
      appliedJobId: action.payload.appliedJobId
    }

    const response = yield call(withdrawAppliedJobService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(withdrawAppliedJobSuccess(response.data.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(withdrawAppliedJobFailed(error))
  }
}

export default function* withdrawAppliedJob() {
  yield takeLatest(WITHDRAW_APPLIED_JOB_REQUEST, withdrawAppliedJobReq)
}
