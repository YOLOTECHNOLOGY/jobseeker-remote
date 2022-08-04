import {
  UPDATE_USER_ONBOARDING_INFO_REQUEST,
  UPDATE_USER_ONBOARDING_INFO_SUCCESS,
  UPDATE_USER_ONBOARDING_INFO_FAILED,
} from 'store/types/users/updateUserOnboardingInfo'

const initialState = {
  fetching: false,
  response: {},
  error: null,
}

export default function updateUserOnboardingInfo(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_ONBOARDING_INFO_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case UPDATE_USER_ONBOARDING_INFO_SUCCESS:
      return {
        ...state,
        fetching: false,
        response: action.payload,
        error: null,
      }
    case UPDATE_USER_ONBOARDING_INFO_FAILED:
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
