import { DISPLAY_NOTIFICATION, CLOSE_NOTIFICATION } from 'store/types/notificationBar/notificationBar'

const initialState = {
  open: false,
  severity: 'info',  /* error, warning, info, success */
  message: '',
  config: null
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISPLAY_NOTIFICATION:
      return {
        ...state,
        open: action.payload.open,
        severity: action.payload.severity,
        message: action.payload.message,
        config: action.payload.config ? action.payload.config : null,
      }
    case CLOSE_NOTIFICATION:
      return {
        ...state,
        open: false
      }
    default:
      return {
        ...state
      }
  }
}

export default notificationReducer
