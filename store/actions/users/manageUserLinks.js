import {
  MANAGE_USER_LINKS_REQUEST,
  MANAGE_USER_LINKS_SUCCESS,
  MANAGE_USER_LINKS_FAILED
} from 'store/types/users/manageUserLinks'

const manageUserLinksRequest = (payload) => ({
  type: MANAGE_USER_LINKS_REQUEST,
  payload
})

const manageUserLinksSuccess = (payload) => ({
  type: MANAGE_USER_LINKS_SUCCESS,
  payload
})

const manageUserLinksFailed = (error) => ({
  type: MANAGE_USER_LINKS_FAILED,
  error
})

export {
  manageUserLinksRequest,
  manageUserLinksSuccess,
  manageUserLinksFailed
}