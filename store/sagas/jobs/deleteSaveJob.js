import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { DELETE_SAVE_JOB_REQUEST } from 'store/types/jobs/deleteSaveJob'
import { deleteSaveJobSuccess, deleteSaveJobFailed } from 'store/actions/jobs/deleteSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'

function* deleteSaveJobReq(action) {
  try {
    const payload = {
      saveJobId: action.payload.saveJobId
    }

    const response = yield call(deleteSaveJobService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(deleteSaveJobSuccess(response.data.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(deleteSaveJobFailed(error))
  }
}

export default function* postSaveJob() {
  yield takeLatest(DELETE_SAVE_JOB_REQUEST, deleteSaveJobReq)
}
