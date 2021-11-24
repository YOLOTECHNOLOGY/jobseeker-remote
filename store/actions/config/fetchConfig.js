import {
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILED,
} from 'store/types/config/fetchConfig'

const fetchConfigRequest = () => ({
  type: FETCH_CONFIG_REQUEST,
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
