import {
    OPEN_MANAGE_JOB_ALERTS_MODAL,
    CLOSE_MANAGE_JOB_ALERTS_MODAL,
  } from 'store/types/modals/manageJobAlertsModal'
  
  const initialState = {
    show: false,
  }
  
  export default function openManageJobAlertsModal(state = initialState, action) {
    switch (action.type) {
      case OPEN_MANAGE_JOB_ALERTS_MODAL:
        return {
          ...state,
          show: true,
        }
      case CLOSE_MANAGE_JOB_ALERTS_MODAL:
        return {
          ...state,
          show: false,
        }
      default:
        return { ...state }
    }
  }
  