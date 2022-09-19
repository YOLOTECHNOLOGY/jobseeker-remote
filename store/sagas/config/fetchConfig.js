import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_CONFIG_REQUEST } from 'store/types/config/fetchConfig'
import {
  fetchConfigSuccess,
  fetchConfigFailed,
} from 'store/actions/config/fetchConfig'
import { fetchConfigService } from 'store/services/config/fetchConfig'
// import { oldFetchConfigService } from 'store/services/config/oldFetchConfig'

function* fetchConfigReq(action) {
  try {
    const { data } = yield call(fetchConfigService, action.payload)
    yield put(fetchConfigSuccess(data.data))
  } catch (error) {
    yield put(fetchConfigFailed(error))
  }
}

export default function* fetchConfig() {
  yield takeLatest(FETCH_CONFIG_REQUEST, fetchConfigReq)
}
