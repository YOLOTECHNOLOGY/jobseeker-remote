import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { DELETE_SAVE_JOB_REQUEST } from 'store/types/jobs/deleteSaveJob'
import { deleteSaveJobSuccess, deleteSaveJobFailed } from 'store/actions/jobs/deleteSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'

function* deleteSaveJobReq(action) {
  const { saveJobId, accessToken } = action.payload
  try {
    const { data } = yield call(deleteSaveJobService, { saveJobId, accessToken })
    yield put(deleteSaveJobSuccess(data.data))
  } catch (error) {
    console.log('error', error)
    yield put(deleteSaveJobFailed(error))
  }
}

export default function* postSaveJob() {
  yield takeLatest(DELETE_SAVE_JOB_REQUEST, deleteSaveJobReq)
}
