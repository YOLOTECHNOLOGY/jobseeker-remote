import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { POST_SAVE_JOB_REQUEST } from 'store/types/jobs/postSaveJob'
import { postSaveJobSuccess, postSaveJobFailed } from 'store/actions/jobs/postSaveJob'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'

function* postSaveJobReq(action) {
  const { jobId, accessToken } = action.payload
  try {
    const { data } = yield call(postSaveJobService, { job_id: jobId, accessToken })
    yield put(postSaveJobSuccess(data.data))
  } catch (error) {
    console.log('error', error)
    yield put(postSaveJobFailed(error))
  }
}

export default function* postSaveJob() {
  yield takeLatest(POST_SAVE_JOB_REQUEST, postSaveJobReq)
}
