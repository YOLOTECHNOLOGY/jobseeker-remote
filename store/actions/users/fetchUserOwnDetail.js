import {
  FETCH_USER_OWN_DETAIL_REQUEST,
  FETCH_USER_OWN_DETAIL_SUCCESS,
  FETCH_USER_OWN_DETAIL_FAILED
} from 'store/types/users/fetchUserOwnDetail'

const fetchUserOwnDetailRequest = (payload) => ({
  type: FETCH_USER_OWN_DETAIL_REQUEST,
  payload,
})

const fetchUserOwnDetailSuccess = (payload) => ({
  type: FETCH_USER_OWN_DETAIL_SUCCESS,
  payload,
})

const fetchUserOwnDetailFailed = (error) => ({
  type: FETCH_USER_OWN_DETAIL_FAILED,
  error,
})

export { fetchUserOwnDetailRequest, fetchUserOwnDetailSuccess, fetchUserOwnDetailFailed }
