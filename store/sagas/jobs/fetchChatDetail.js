import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_CHAT_DETAIL_REQUEST } from 'store/types/jobs/fetchChatDetail'
import { fetchChatDetailSuccess, fetchChatDetailFailed } from 'store/actions/jobs/fetchJobChatDetail'
import { fetchChatDetailService } from 'store/services/jobs/fetchChatDetail'

function* fetchChatDetailReq(actions) {
  try {
    const payload = {
      recruiterId: actions.payload.recruiterId,
      status: actions.payload.status || '',
      serverAccessToken: actions.payload.serverAccessToken || null,
    }
    const jobDetailResponse = yield call(fetchChatDetailService, { ...payload })

    if (jobDetailResponse.status >= 200 && jobDetailResponse.status < 300) {
      yield put(fetchChatDetailSuccess(jobDetailResponse.data.data))

    }
  } catch (err) {
    yield put(fetchChatDetailFailed(err))
  }
}

export default function* fetchChatDetail() {
  yield takeLatest(FETCH_CHAT_DETAIL_REQUEST, fetchChatDetailReq)
}
