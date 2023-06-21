import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_COMPANY_DETAIL_REQUEST } from 'store/types/companies/fetchCompanyDetail'
import {
  fetchCompanyDetailSuccess,
  fetchCompanyDetailFailed,
} from 'store/actions/companies/fetchCompanyDetail'
import { fetchCompanyDetailService } from 'store/services/companies2/fetchCompanyDetail'

function* fetchCompanyDetailReq(actions) {
  try {
    const { payload } = actions
    const response = yield call(fetchCompanyDetailService, payload)

    if (response.status >= 200 && response.status < 300) {
      yield put(
        fetchCompanyDetailSuccess(response.data)
      )
    }
  } catch (err) {
    yield put(fetchCompanyDetailFailed(err))
  }
}

export default function* fetchCompanyDetail() {
  yield takeLatest(FETCH_COMPANY_DETAIL_REQUEST, fetchCompanyDetailReq)
}