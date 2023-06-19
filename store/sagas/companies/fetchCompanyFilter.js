import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_COMPANY_FILTER_REQUEST } from 'store/types/companies/fetchCompanyFilter'
import {
  fetchCompanyFilterSuccess,
  fetchCompanyFilterFailed,
} from 'store/actions/companies/fetchCompanyFilter'
import { fetchCompanyFilterService } from 'store/services/companies2/fetchCompanyFilter'

function* fetchCompanyFilterReq(actions) {
  try {
    const { data } = yield call(fetchCompanyFilterService, actions.payload)
    yield put(fetchCompanyFilterSuccess(data.data))
  } catch (error) {
    yield put(fetchCompanyFilterFailed(error))
  }
}

export default function* fetchCompanyFilter() {
  yield takeLatest(FETCH_COMPANY_FILTER_REQUEST, fetchCompanyFilterReq)
}
