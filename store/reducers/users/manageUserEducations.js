import {
    MANAGE_USER_EDUCATIONS_REQUEST,
    MANAGE_USER_EDUCATIONS_SUCCESS,
    MANAGE_USER_EDUCATIONS_FAILED,
  } from 'store/types/users/manageUserEducations'
  
  const initialState = {
    fetching: false,
    response: {},
    error: null,
  }

  export default function manageUserEducations(state = initialState, action) {
    switch (action.type) {
      case MANAGE_USER_EDUCATIONS_REQUEST:
        return {
          ...state,
          fetching: true,
        }
      case MANAGE_USER_EDUCATIONS_SUCCESS:
        return {
          ...state,
          fetching: false,
          response: action.payload,
          error: null,
        }
      case MANAGE_USER_EDUCATIONS_FAILED:
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
  