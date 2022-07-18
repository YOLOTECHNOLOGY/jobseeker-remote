import {
  OPEN_CREATE_JOB_ALERT_MODAL,
  CLOSE_CREATE_JOB_ALERT_MODAL,
} from 'store/types/modals/createJobAlertModal'

const initialState = {
  show: false,
}

export default function createJobAlertModal(state = initialState, action) {
  switch (action.type) {
    case OPEN_CREATE_JOB_ALERT_MODAL:
      return {
        ...state,
        show: true,
      }
    case CLOSE_CREATE_JOB_ALERT_MODAL:
      return {
        ...state,
        show: false,
      }
    default:
      return { ...state }
  }
}
