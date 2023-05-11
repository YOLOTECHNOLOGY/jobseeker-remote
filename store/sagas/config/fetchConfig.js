import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_CONFIG_REQUEST } from 'store/types/config/fetchConfig'
import {
  fetchConfigSuccess,
  fetchConfigFailed,
} from 'store/actions/config/fetchConfig'
import { fetchConfigService } from 'store/services/config/fetchConfig'
import dayjs from 'dayjs'

// key: e.g. ph_en-US ph_zh-CN
const cached = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cachedConfig-' + key, JSON.stringify(data))
    localStorage.setItem('configRefreshTime-' + key, dayjs().format('YYYY-MM-DD'))
  } else {
    globalThis['cachedConfig-' + key] = data
    globalThis['configRefreshTime-' + key] = dayjs().format('YYYY-MM-DD')
  }
}

const load = (key) => {
  if (typeof window !== 'undefined') {
    const data = JSON.parse(localStorage.getItem('cachedConfig-' + key))
    const time = localStorage.getItem('configRefreshTime-' + key)
    return { data, time }
  } else {
    return {
      data: globalThis['cachedConfig-' + key],
      time: globalThis['configRefreshTime-' + key]
    }
  }
}

function* fetchConfigReq(action) {
  const { payload } = action
  try {
    const key = Array.isArray(payload) ? payload.join('_') : payload
    const { data, time: lastDate } = load(key)
    let result = data
    if (!result) {
      result = yield call(fetchConfigService, payload)
      cached(key, result)
    } else {
      const daypassed = dayjs().diff(dayjs(lastDate), 'days')
      if (daypassed > 3) {
        result = yield call(fetchConfigService, payload)
        cached(key, result)
      } else {
        // yield delay(0)
      }
    }
    yield put(fetchConfigSuccess(result))
  } catch (error) {
    yield put(fetchConfigFailed(error))
  }
}

export default function* fetchConfig() {
  yield takeLatest(FETCH_CONFIG_REQUEST, fetchConfigReq)
}
