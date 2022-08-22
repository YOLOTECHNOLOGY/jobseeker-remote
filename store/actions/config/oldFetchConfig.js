import {
  OLD_FETCH_CONFIG_REQUEST,
  OLD_FETCH_CONFIG_SUCCESS,
  OLD_FETCH_CONFIG_FAILED,
} from 'store/types/config/oldFetchConfig'

const oldFetchConfigRequest = () => ({
  type: OLD_FETCH_CONFIG_REQUEST,
})

const oldFetchConfigSuccess = (payload) => ({
  type: OLD_FETCH_CONFIG_SUCCESS,
  payload,
})

const oldFetchConfigFailed = (error) => ({
  type: OLD_FETCH_CONFIG_FAILED,
  error,
})

export {
  oldFetchConfigRequest,
  oldFetchConfigSuccess,
  oldFetchConfigFailed,
}