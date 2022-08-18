/* Redux */
import { call, put, takeLatest } from 'redux-saga/effects'
import { MANAGE_USER_LINKS_REQUEST } from 'store/types/users/manageUserLinks'

import { addUserLinkService } from 'store/services/users/addUserLinks'
import { updateUserLinkService } from 'store/services/users/updateUserLinks'
import { deleteUserLinkService } from 'store/services/users/deleteUserLinks'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { manageUserLinksSuccess, manageUserLinksFailed } from 'store/actions/users/manageUserLinks'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { checkErrorCode } from 'helpers/errorHandlers'

function* manageUserLinksReq({ payload }) {
  const { isDelete, isUpdate, linkId, linkData } = payload
  const accessToken = getCookie('accessToken')

  try {
    let response = null
    if (isDelete) {
      const deletePayload = {
        accessToken,
        linkId
      }
      const { data } = yield call(deleteUserLinkService, deletePayload)
      response = data.data
    }

    if (isUpdate) {
      const updatePayload = {
        accessToken,
        linkId,
        linkData
      }
      const { data } = yield call(updateUserLinkService, updatePayload)
      response = data.data
    }

    if (!isDelete && !isUpdate) {
      const addPayload = { accessToken, linkData: linkData }
      const { data } = yield call(addUserLinkService, addPayload)
      response = data.data
    }

    yield put(manageUserLinksSuccess(response))

    yield put(fetchUserOwnDetailRequest({ accessToken }))
  } catch (error) {
    const isServerError = checkErrorCode(error)
    if (isServerError) {
      yield put(
        displayNotification({
          open: true,
          severity: 'error',
          message:
            'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
        })
      )
    } else {
      yield put(manageUserLinksFailed(error))
    }
  }
}

export default function* manageUserLinksSaga() {
  yield takeLatest(MANAGE_USER_LINKS_REQUEST, manageUserLinksReq)
}