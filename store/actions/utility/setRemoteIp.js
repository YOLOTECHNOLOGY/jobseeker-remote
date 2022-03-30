import { SET_REMOTE_IP } from 'store/types/utility/setRemoteIp'

const setRemoteIp = (ipAddress) => ({
  type: SET_REMOTE_IP,
  ipAddress,
})

export {
  setRemoteIp,
}
