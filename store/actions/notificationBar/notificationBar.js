import {
  DISPLAY_NOTIFICATION, CLOSE_NOTIFICATION
} from 'store/types/notificationBar/notificationBar'

const displayNotification = (state) => ({
  type: DISPLAY_NOTIFICATION,
  payload: state,
})

const closeNotification = (state) => ({
  type: CLOSE_NOTIFICATION,
  payload: state,
})

export { displayNotification, closeNotification }
