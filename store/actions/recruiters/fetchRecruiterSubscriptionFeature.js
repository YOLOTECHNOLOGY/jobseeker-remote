import {
  FETCH_RECRUITER_SUBSCRIPTION_FEATURE_REQUEST,
  FETCH_RECRUITER_SUBSCRIPTION_FEATURE_FAILED,
  FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS,
} from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'

const fetchRecruiterSubscriptionFeatureRequest = (payload) => ({
  type: FETCH_RECRUITER_SUBSCRIPTION_FEATURE_REQUEST,
  payload,
})

const fetchRecruiterSubscriptionFeatureSuccess = (payload) => ({
  type: FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS,
  payload,
})

const fetchRecruiterSubscriptionFeatureFailed = (error) => ({
  type: FETCH_RECRUITER_SUBSCRIPTION_FEATURE_FAILED,
  error,
})

export { fetchRecruiterSubscriptionFeatureRequest, fetchRecruiterSubscriptionFeatureSuccess, fetchRecruiterSubscriptionFeatureFailed }
