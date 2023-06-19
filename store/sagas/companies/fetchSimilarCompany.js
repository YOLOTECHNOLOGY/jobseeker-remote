import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_SIMILAR_COMPANY_REQUEST } from 'store/types/companies/fetchSimilarCompany'
import {
  fetchSimilarCompanySuccess,
  fetchSimilarCompanyFailed,
} from 'store/actions/companies/fetchSimilarCompany'
import { fetchSimilarCompanyService } from 'store/services/companies2/fetchSimilarCompany'

function* fetchSimilarCompanyReq(actions) {
  const { companyId } = actions.payload
  try {
    const payload = {
      companyId,
      query: {
        size: 10
      }
    }
    const { data } = yield call(fetchSimilarCompanyService, payload)
    yield put(fetchSimilarCompanySuccess(data.data))
  } catch (err) {
    yield put(fetchSimilarCompanyFailed(err))
  }
}

export default function* fetchSimilarCompany() {
  yield takeLatest(FETCH_SIMILAR_COMPANY_REQUEST, fetchSimilarCompanyReq)
}