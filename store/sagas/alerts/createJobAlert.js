import { call, put, takeLatest } from 'redux-saga/effects'
import { CREATE_JOB_ALERT_REQUEST } from 'store/types/alerts/createJobAlert'
import {
  createJobAlertSuccess,
  createJobAlertFailed,
} from 'store/actions/alerts/createJobAlert'
import { createJobAlertService } from 'store/services/alerts/createJobAlert'

function* createJobAlertReq(action) {
  try {
    const { data } = yield call(createJobAlertService, action.payload)
    yield put(createJobAlertSuccess(data.data))
  } catch (error) {
    yield put(createJobAlertFailed(error))
  }
}

export default function* createJobAlertSaga() {
  yield takeLatest(CREATE_JOB_ALERT_REQUEST, createJobAlertReq)
}
