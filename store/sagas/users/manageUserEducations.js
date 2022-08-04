/* Redux */
import { call, put, takeLatest } from 'redux-saga/effects'
import { MANAGE_USER_EDUCATIONS_REQUEST } from 'store/types/users/manageUserEducations'

import { addUserEducationService } from 'store/services/users/addUserEducation'
import { deleteUserEducationService } from 'store/services/users/deleteUserEducation'
import { updateUserEducationService } from 'store/services/users/updateUserEducation'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { manageUserEducationsFailed, manageUserEducationsSuccess } from 'store/actions/users/manageUserEducations'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { checkErrorCode } from 'helpers/errorHandlers'

function* manageUserEducationsReq({ payload }) {
  const { isDelete, isUpdate, educationId, educationData } = payload
  const accessToken = getCookie('accessToken')

  try {
    let response = null
    if (isDelete) {
      const deletePayload = {
        accessToken,
        educationId,
      }
      const { data } = yield call(deleteUserEducationService, deletePayload)
      response = data.data
    }

    if (isUpdate) {
      const updatePayload = {
        accessToken,
        educationId,
        educationData,
      }
      const { data } = yield call(updateUserEducationService, updatePayload)
      response = data.data
    }

    if (!isDelete && !isUpdate) {
      const addPayload = { accessToken, educationData: educationData }
      const { data } = yield call(addUserEducationService, addPayload)
      response = data.data
    }

    yield put(manageUserEducationsSuccess(response))

    //   Refetch user detail
    yield put(fetchUserOwnDetailRequest({ accessToken }))
  } catch (error) {
    const isServerError = checkErrorCode(error)
    if (isServerError) {
      yield put(
        displayNotification({
          open: true,
          severity: 'error',
          message:
            'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.',
        })
      )
    } else {
      yield put(manageUserEducationsFailed(error))
    }
  }
}

export default function* manageUserEducationsSaga() {
  yield takeLatest(MANAGE_USER_EDUCATIONS_REQUEST, manageUserEducationsReq)
}
