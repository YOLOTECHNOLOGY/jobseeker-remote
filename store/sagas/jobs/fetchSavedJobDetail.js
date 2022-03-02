import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_SAVED_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchSavedJobDetail'
import { fetchSavedJobDetailSuccess, fetchSavedJobDetailFailed } from 'store/actions/jobs/fetchSavedJobDetail'
import { fetchSavedJobDetailService } from 'store/services/jobs/fetchSavedJobDetail'

function* fetchSavedJobDetailReq(action) {
  try {
    const payload = {
      accessToken: action.payload.accessToken,
      savedJobId: action.payload.savedJobId,
    }

    const response = yield call(fetchSavedJobDetailService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchSavedJobDetailSuccess(response.data.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(fetchSavedJobDetailFailed(error))
  }
}

export default function* fetchSavedJobDetail() {
  yield takeLatest(FETCH_SAVED_JOB_DETAIL_REQUEST, fetchSavedJobDetailReq)
}
