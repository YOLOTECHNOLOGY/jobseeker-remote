import {
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILED,
} from 'store/types/config/fetchConfig'

// we can use payload to pass params on server side, and this payload only can be used on server
const fetchConfigRequest = (payload) => ({
  type: FETCH_CONFIG_REQUEST,
  payload
})

const fetchConfigSuccess = (payload) => ({
  type: FETCH_CONFIG_SUCCESS,
  payload,
})

const fetchConfigFailed = (error) => ({
  type: FETCH_CONFIG_FAILED,
  error,
})

export {
  fetchConfigRequest,
  fetchConfigSuccess,
  fetchConfigFailed,
}
