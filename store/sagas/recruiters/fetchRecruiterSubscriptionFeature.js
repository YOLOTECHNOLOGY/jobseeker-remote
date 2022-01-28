import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_RECRUITER_SUBSCRIPTION_FEATURE_REQUEST } from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'
import {
  fetchRecruiterSubscriptionFeatureSuccess,
  fetchRecruiterSubscriptionFeatureFailed,
} from 'store/actions/recruiters/fetchRecruiterSubscriptionFeature'
import { fetchRecruiterSubscriptionFeatureService } from 'store/services/recruiters/fetchRecruiterSubscriptionFeature'

function* fetchRecruiterSubscriptionFeatureReq(action) {
  try {
    const { data } = yield call(fetchRecruiterSubscriptionFeatureService, action.payload)
    yield put(fetchRecruiterSubscriptionFeatureSuccess(data.data))
  } catch (error) {
    yield put(fetchRecruiterSubscriptionFeatureFailed(error))
  }
}

export default function* fetchRecruiterSubscriptionFeature() {
  yield takeLatest(FETCH_RECRUITER_SUBSCRIPTION_FEATURE_REQUEST, fetchRecruiterSubscriptionFeatureReq)
}
