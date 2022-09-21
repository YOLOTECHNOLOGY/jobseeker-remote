import {
  FETCH_USER_DETAIL_REQUEST,
  FETCH_USER_DETAIL_SUCCESS,
  FETCH_USER_DETAIL_FAILED
} from 'store/types/users/fetchUserDetail'

const fetchUserDetailRequest = (payload) => ({
  type: FETCH_USER_DETAIL_REQUEST,
  payload
})

const fetchUserDetailSuccess = (payload) => ({
  type: FETCH_USER_DETAIL_SUCCESS,
  payload
})

const fetchUserDetailFailed = (error) => ({
  type: FETCH_USER_DETAIL_FAILED,
  error
})

export { fetchUserDetailRequest, fetchUserDetailSuccess, fetchUserDetailFailed }
