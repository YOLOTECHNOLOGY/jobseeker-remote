import {
  FETCH_RECRUITER_SUBSCRIPTION_FEATURE_REQUEST,
  FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS,
  FETCH_RECRUITER_SUBSCRIPTION_FEATURE_FAILED,
} from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function fetchRecruiterSubscriptionFeature(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECRUITER_SUBSCRIPTION_FEATURE_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case FETCH_RECRUITER_SUBSCRIPTION_FEATURE_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        response: {},
      }
    default:
      return { ...state }
  }
}
