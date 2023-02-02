import {
  FETCH_CHAT_DETAIL_REQUEST,
  FETCH_CHAT_DETAIL_SUCCESS,
  FETCH_CHAT_DETAIL_FAILED,
} from 'store/types/jobs/fetchChatDetail'

const fetchChatDetailRequest = (payload) => ({
  type: FETCH_CHAT_DETAIL_REQUEST,
  payload,
})

const fetchChatDetailSuccess = (payload) => ({
  type: FETCH_CHAT_DETAIL_SUCCESS,
  payload,
})

const fetchChatDetailFailed = (error) => ({
  type: FETCH_CHAT_DETAIL_FAILED,
  error,
})
export { fetchChatDetailRequest, fetchChatDetailSuccess, fetchChatDetailFailed }
