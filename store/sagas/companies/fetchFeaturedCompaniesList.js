import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_FEATURED_COMPANIES_LIST_REQUEST } from 'store/types/companies/fetchFeaturedCompaniesList'
import {
  fetchFeaturedCompaniesListSuccess,
  fetchFeaturedCompaniesListFailed,
} from 'store/actions/companies/fetchFeaturedCompaniesList'
import { fetchFeaturedCompaniesListService } from 'store/services/companies/fetchFeaturedCompaniesList'

function* fetchFeaturedCompaniesListReq() {
  try {
    const payload = {
      size: 10,
      page: 1
    }
    const { data } = yield call(fetchFeaturedCompaniesListService, payload)
    yield put(fetchFeaturedCompaniesListSuccess(data.data))
  } catch (error) {
    yield put(fetchFeaturedCompaniesListFailed(error))
  }
}

export default function* fetchFeaturedCompaniesList() {
  yield takeLatest(FETCH_FEATURED_COMPANIES_LIST_REQUEST, fetchFeaturedCompaniesListReq)
}
