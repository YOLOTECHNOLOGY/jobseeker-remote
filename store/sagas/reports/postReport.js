import { call, put, takeLatest } from 'redux-saga/effects'
import { POST_REPORT_REQUEST } from 'store/types/reports/postReport'
import {
  postReportSuccess,
  postReportFailed,
} from 'store/actions/reports/postReport'
import { postReportService } from 'store/services/reports/postReport'

function* postReportReq(action) {
  const { reportJobData, accessToken } = action.payload
  try {
    const { data } = yield call(postReportService, { reportJobData, accessToken })
    yield put(postReportSuccess(data.data))
  } catch (error) {
    yield put(postReportFailed(error))
  }
}

export default function* postReportSaga() {
  yield takeLatest(POST_REPORT_REQUEST, postReportReq)
}
