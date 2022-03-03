import { call, put, takeLatest } from 'redux-saga/effects'
import { DELETE_JOB_ALERT_REQUEST } from 'store/types/alerts/deleteJobAlert'
import {
  deleteJobAlertSuccess,
  deleteJobAlertFailed,
} from 'store/actions/alerts/deleteJobAlert'
import { deleteJobAlertService } from 'store/services/alerts/deleteJobAlert'

function* deleteJobAlertReq(action) {
  const payload = {
    accessToken: action.payload.accessToken,
    jobAlertId: action.payload.jobAlertId,
  }
  try {
    const { data } = yield call(deleteJobAlertService, payload)
    yield put(deleteJobAlertSuccess(data.data))
  } catch (error) {
    yield put(deleteJobAlertFailed(error))
  }
}

export default function* deleteJobAlertSaga() {
  yield takeLatest(DELETE_JOB_ALERT_REQUEST, deleteJobAlertReq)
}
