import {
    OPEN_DELETE_JOB_ALERT_MODAL,
    CLOSE_DELETE_JOB_ALERT_MODAL,
  } from 'store/types/modals/deleteJobAlertModal'
  
  const initialState = {
    show: false,
  }
  
  export default function deleteJobAlertModal(state = initialState, action) {
    switch (action.type) {
      case OPEN_DELETE_JOB_ALERT_MODAL:
        return {
          ...state,
          show: true,
        }
      case CLOSE_DELETE_JOB_ALERT_MODAL:
        return {
          ...state,
          show: false,
        }
      default:
        return { ...state }
    }
  }
  