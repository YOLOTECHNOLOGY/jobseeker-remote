import { call, put, takeLatest } from 'redux-saga/effects'
import { UPDATE_JOB_ALERT_REQUEST } from 'store/types/alerts/updateJobAlert'
import {
  updateJobAlertSuccess,
  updateJobAlertFailed,
} from 'store/actions/alerts/updateJobAlert'
import { updateJobAlertService } from 'store/services/alerts/updateJobAlert'

function* updateJobAlertReq(action) {
  const { accessToken, updateJobAlertData } = action.payload
  try {
    const { data } = yield call(updateJobAlertService, { accessToken, updateJobAlertData })
    yield put(updateJobAlertSuccess(data.data))
  } catch (error) {
    yield put(updateJobAlertFailed(error))
  }
}

export default function* updateJobAlertSaga() {
  yield takeLatest(UPDATE_JOB_ALERT_REQUEST, updateJobAlertReq)
}
