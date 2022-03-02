import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { POST_SAVE_JOB_REQUEST } from 'store/types/jobs/postSaveJob'
import { postSaveJobSuccess, postSaveJobFailed } from 'store/actions/jobs/postSaveJob'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'

function* postSaveJobReq(action) {
  try {
    const payload = {
      accessToken: action.payload.accessToken,
      job_id: action.payload.jobId
    }

    const response = yield call(postSaveJobService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(postSaveJobSuccess(response.data.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(postSaveJobFailed(error))
  }
}

export default function* postSaveJob() {
  yield takeLatest(POST_SAVE_JOB_REQUEST, postSaveJobReq)
}
