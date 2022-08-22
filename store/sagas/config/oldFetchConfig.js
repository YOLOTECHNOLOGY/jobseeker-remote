import { call, put, takeLatest } from 'redux-saga/effects'
import { OLD_FETCH_CONFIG_REQUEST } from 'store/types/config/oldFetchConfig'
import {
  oldFetchConfigSuccess,
  oldFetchConfigFailed
} from 'store/actions/config/oldFetchConfig'
import { oldFetchConfigService } from 'store/services/config/oldFetchConfig'

function* oldFetchConfigReq(action) {
  try {
    const { data } = yield call(oldFetchConfigService, action.payload)
    yield put(oldFetchConfigSuccess(data.data))
  } catch (error) {
    yield put(oldFetchConfigFailed(error))
  }
}

export default function* oldFetchConfig() {
  yield takeLatest(OLD_FETCH_CONFIG_REQUEST, oldFetchConfigReq)
}