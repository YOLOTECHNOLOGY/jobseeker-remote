import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_SAVED_JOBS_LIST_REQUEST } from 'store/types/jobs/fetchSavedJobsList'
import { fetchSavedJobsListSuccess, fetchSavedJobsListFailed } from 'store/actions/jobs/fetchSavedJobsList'
import { fetchSavedJobsListService } from 'store/services/jobs/fetchSavedJobsList'

function* fetchSavedJobsListReq(action) {
  try {
    const {
      page,
      sort,
    } = action.payload

    const payload = {
      sort,
      page,
    }

    const response = yield call(fetchSavedJobsListService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchSavedJobsListSuccess(response.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(fetchSavedJobsListFailed(error))
  }
}

export default function* fetchSavedJobsList() {
  yield takeLatest(FETCH_SAVED_JOBS_LIST_REQUEST, fetchSavedJobsListReq)
}
