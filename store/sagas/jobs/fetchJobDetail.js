import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchJobDetail'
import { fetchJobDetailSuccess, fetchJobDetailFailed } from 'store/actions/jobs/fetchJobDetail'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { addJobViewService } from 'store/services/jobs/addJobView'

function* fetchJobDetailReq(actions) {
  try {
    const payload = {
      jobId: actions.payload.jobId,
      status: actions.payload.status || '',
      serverAccessToken: actions.payload.serverAccessToken || null,
    }

    const jobDetailResponse = yield call(fetchJobDetailService, { ...payload })

    if (jobDetailResponse.status >= 200 && jobDetailResponse.status < 300) {
      
      yield put(fetchJobDetailSuccess(jobDetailResponse.data.data))

      yield call(addJobViewService, { ...payload })
    }
  } catch (err) {
    yield put(fetchJobDetailFailed(err))
  }
}

export default function* fetchJobDetail() {
  yield takeLatest(FETCH_JOB_DETAIL_REQUEST, fetchJobDetailReq)
}
