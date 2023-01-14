import {
  FETCH_USER_OWN_DETAIL_REQUEST,
  FETCH_USER_OWN_DETAIL_SUCCESS,
  FETCH_USER_OWN_DETAIL_FAILED,
  FETCH_USER_OWN_SET_MOBILE_VERIFIED,
  FETCH_USER_OWN_CLEAR
} from 'store/types/users/fetchUserOwnDetail'

const fetchUserOwnDetailRequest = (payload) => ({
  type: FETCH_USER_OWN_DETAIL_REQUEST,
  payload,
})

const fetchUserOwnDetailSuccess = (payload) => ({
  type: FETCH_USER_OWN_DETAIL_SUCCESS,
  payload,
})
const fetchUserOwnDetailSetMobileVerified = () => ({
  type: FETCH_USER_OWN_SET_MOBILE_VERIFIED,
})

const fetchUserOwnDetailClear = () => ({
  type: FETCH_USER_OWN_CLEAR,
})

const fetchUserOwnDetailFailed = (error) => ({
  type: FETCH_USER_OWN_DETAIL_FAILED,
  error,
})

export {
  fetchUserOwnDetailRequest,
  fetchUserOwnDetailSuccess,
  fetchUserOwnDetailFailed,
  fetchUserOwnDetailSetMobileVerified,
  fetchUserOwnDetailClear
}
