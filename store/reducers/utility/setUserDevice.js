import { SET_USER_DEVICE } from 'store/types/utility/setUserDevice'

export default function setUserDevice(state = { userAgent: null }, action) {
  switch (action.type) {
    case SET_USER_DEVICE:
      return { ...state, userAgent: action.userAgent }
    default:
      return { ...state }
  }
}
