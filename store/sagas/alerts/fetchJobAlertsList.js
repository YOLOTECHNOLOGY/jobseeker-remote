import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_JOB_ALERTS_LIST_REQUEST } from 'store/types/alerts/fetchJobAlertsList'
import {
  fetchJobAlertsListSuccess,
  fetchJobAlertsListFailed,
} from 'store/actions/alerts/fetchJobAlertsList'
import { fetchJobAlertsListService } from 'store/services/alerts/fetchJobAlertsList'

function* fetchJobAlertsListReq(action) {
  try {
    const { data } = yield call(fetchJobAlertsListService, action.payload)
    yield put(fetchJobAlertsListSuccess(data))
  } catch (error) {
    yield put(fetchJobAlertsListFailed(error))
  }
}

export default function* fetchJobAlertsListSaga() {
  yield takeLatest(FETCH_JOB_ALERTS_LIST_REQUEST, fetchJobAlertsListReq)
}
