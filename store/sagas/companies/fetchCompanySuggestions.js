import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_COMPANY_SUGGESTIONS_REQUEST } from 'store/types/companies/fetchCompanySuggestions'
import {
  fetchCompanySuggestionsSuccess,
  fetchCompanySuggestionsFailed,
} from 'store/actions/companies/fetchCompanySuggestions'
import { fetchCompanySuggestionsService } from 'store/services/companies2/fetchCompanySuggestions'

function* fetchCompanySuggestionsReq(actions) {
  const { query, size, page } = actions.payload
  try {
    const { data } = yield call(fetchCompanySuggestionsService, { query, size, page })
    yield put(fetchCompanySuggestionsSuccess(data.data))
  } catch (error) {
    yield put(fetchCompanySuggestionsFailed(error))
  }
}

export default function* fetchCompanySuggestions() {
  yield takeLatest(FETCH_COMPANY_SUGGESTIONS_REQUEST, fetchCompanySuggestionsReq)
}
