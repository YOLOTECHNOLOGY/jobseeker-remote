import { SET_REMOTE_IP } from 'store/types/utility/setRemoteIp'

export default function setRemoteIp(state = { ipAddress: null }, action) {
  switch (action.type) {
    case SET_REMOTE_IP:
      return { ...state, ipAddress: action.ipAddress }
    default:
      return { ...state }
  }
}
