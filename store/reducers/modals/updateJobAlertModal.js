import {
    OPEN_UPDATE_JOB_ALERT_MODAL,
    CLOSE_UPDATE_JOB_ALERT_MODAL,
  } from 'store/types/modals/updateJobAlertModal'
  
  const initialState = {
    show: false,
  }
  
  export default function updateJobAlertModal(state = initialState, action) {
    switch (action.type) {
      case OPEN_UPDATE_JOB_ALERT_MODAL:
        return {
          ...state,
          show: true,
        }
      case CLOSE_UPDATE_JOB_ALERT_MODAL:
        return {
          ...state,
          show: false,
        }
      default:
        return { ...state }
    }
  }
  