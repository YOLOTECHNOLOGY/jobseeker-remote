import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_APPLIED_JOBS_LIST_REQUEST } from 'store/types/jobs/fetchAppliedJobsList'
import { fetchAppliedJobsListSuccess, fetchAppliedJobsListFailed } from 'store/actions/jobs/fetchAppliedJobsList'
import { fetchAppliedJobsListService } from 'store/services/jobs/fetchAppliedJobsList'

function* fetchAppliedJobsListReq(action) {
  try {
    const {
      accessToken,
      page,
      sort,
    } = action.payload

    const payload = {
      accessToken,
      sort,
      page,
    }

    const response = yield call(fetchAppliedJobsListService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchAppliedJobsListSuccess(response.data))
    }
  } catch (error) {
    yield put(fetchAppliedJobsListFailed(error))
  }
}

export default function* fetchAppliedJobsList() {
  yield takeLatest(FETCH_APPLIED_JOBS_LIST_REQUEST, fetchAppliedJobsListReq)
}
