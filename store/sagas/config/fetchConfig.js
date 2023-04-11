import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_CONFIG_REQUEST } from 'store/types/config/fetchConfig'
import {
  fetchConfigSuccess,
  fetchConfigFailed,
} from 'store/actions/config/fetchConfig'
import { fetchConfigService } from 'store/services/config/fetchConfig'
import dayjs from 'dayjs'
import { getCountryKey } from 'helpers/country'
const countryKey = getCountryKey()
const cached = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cachedConfig-' + countryKey, JSON.stringify(data))
    localStorage.setItem('configRefreshTime-' + countryKey, dayjs().format('YYYY-MM-DD'))
  } else {
    globalThis['cachedConfig-' + countryKey] = data
    globalThis['configRefreshTime-' + countryKey] = dayjs().format('YYYY-MM-DD')
  }
}

const load = () => {
  if (typeof window !== 'undefined') {
    const data = JSON.parse(localStorage.getItem('cachedConfig-' + countryKey))
    const time = localStorage.getItem('configRefreshTime-' + countryKey)
    return { data, time }
  } else {
    return {
      data: globalThis['cachedConfig-' + countryKey],
      time: globalThis['configRefreshTime-' + countryKey]
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
