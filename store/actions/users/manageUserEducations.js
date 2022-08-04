import {
    MANAGE_USER_EDUCATIONS_REQUEST,
    MANAGE_USER_EDUCATIONS_SUCCESS,
    MANAGE_USER_EDUCATIONS_FAILED,
  } from 'store/types/users/manageUserEducations'
  
  const manageUserEducationsRequest = (payload) => ({
    type: MANAGE_USER_EDUCATIONS_REQUEST,
    payload,
  })
  
  const manageUserEducationsSuccess = (payload) => ({
    type: MANAGE_USER_EDUCATIONS_SUCCESS,
    payload,
  })
  
  const manageUserEducationsFailed = (error) => ({
    type: MANAGE_USER_EDUCATIONS_FAILED,
    error,
  })
  
  export {
    manageUserEducationsRequest,
    manageUserEducationsSuccess,
    manageUserEducationsFailed,
  }
  