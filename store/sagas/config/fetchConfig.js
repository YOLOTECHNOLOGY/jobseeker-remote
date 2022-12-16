import { call, put, takeLatest, delay } from 'redux-saga/effects'
import { FETCH_CONFIG_REQUEST } from 'store/types/config/fetchConfig'
import {
  fetchConfigSuccess,
  fetchConfigFailed,
} from 'store/actions/config/fetchConfig'
import { fetchConfigService } from 'store/services/config/fetchConfig'
import dayjs from 'dayjs'

const cached = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cachedConfig', JSON.stringify(data))
    localStorage.setItem('configRefreshTime', dayjs().format('YYYY-MM-DD'))
  } else {
    globalThis.cachedConfig = data
    globalThis.configRefreshTime = dayjs().format('YYYY-MM-DD')
  }
}

const load = () => {
  if (typeof window !== 'undefined') {
    const data = JSON.parse(localStorage.getItem('cachedConfig'))
    const time = localStorage.getItem('configRefreshTime')
    return { data, time }
  } else {
    return {
      data: globalThis.cachedConfig,
      time: globalThis.configRefreshTime
    }
  }
}

function* fetchConfigReq(action) {
  try {
    const { data, time: lastDate } = load()
    let result = data
    if (!result) {
      result = yield call(fetchConfigService, action.payload)
      cached(result)
    } else {
      const daypassed = dayjs().diff(dayjs(lastDate), 'days')
      if (daypassed > 3) {
        result = yield call(fetchConfigService, action.payload)
        cached(result)
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
