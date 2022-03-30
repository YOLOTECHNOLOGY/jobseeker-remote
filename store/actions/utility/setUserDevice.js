import { SET_USER_DEVICE } from 'store/types/utility/setUserDevice'

const setUserDevice = (userAgent) => ({
  type: SET_USER_DEVICE,
  userAgent,
})

export {
  setUserDevice,
}
