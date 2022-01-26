import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_SIMILAR_JOBS_REQUEST } from 'store/types/jobs/fetchSimilarJobs'
import { fetchSimilarJobsSuccess, fetchSimilarJobsFailed } from 'store/actions/jobs/fetchSimilarJobs'
import { fetchSimilarJobsService } from 'store/services/jobs/fetchSimilarJobs'

function* fetchSimilarJobsReq(actions) {
  console.log('actions----', actions)
  try {
    const payload = {
      jobId: actions.payload.jobId
    }

    const response = yield call(fetchSimilarJobsService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchSimilarJobsSuccess(response.data.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(fetchSimilarJobsFailed(error))
  }
}

export default function* fetchSimilarJobs() {
  yield takeLatest(FETCH_SIMILAR_JOBS_REQUEST, fetchSimilarJobsReq)
}
