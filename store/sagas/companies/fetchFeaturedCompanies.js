import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_FEATURED_COMPANIES_REQUEST } from 'store/types/companies/fetchFeaturedCompanies'
import {
  fetchFeaturedCompaniesSuccess,
  fetchFeaturedCompaniesFailed,
} from 'store/actions/companies/fetchFeaturedCompanies'
import { fetchFeaturedCompaniesService } from 'store/services/companies/fetchFeaturedCompanies'

function* fetchFeaturedCompaniesReq(action) {
  try {
    const { data } = yield call(fetchFeaturedCompaniesService, action.payload)
    yield put(fetchFeaturedCompaniesSuccess(data.data))
  } catch (error) {
    yield put(fetchFeaturedCompaniesFailed(error))
  }
}

export default function* fetchFeaturedCompanies() {
  yield takeLatest(FETCH_FEATURED_COMPANIES_REQUEST, fetchFeaturedCompaniesReq)
}
