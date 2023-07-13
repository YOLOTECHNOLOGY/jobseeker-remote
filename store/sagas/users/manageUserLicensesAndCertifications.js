/* Redux */
import { call, put, takeLatest } from 'redux-saga/effects'
import { MANAGE_USER_LICENSES_CERTIFICATIONS_REQUEST } from 'store/types/users/manageUserLicensesAndCertifications'

import { addUserLicensesAndCertificationsService } from 'store/services/users/addUserLicensesAndCertifications'
import { updateUserLicensesAndCertificationsService } from 'store/services/users/updateUserLicensesAndCertifications'
import { deleteUserLicensesAndCertificationsService } from 'store/services/users/deleteUserLicensesAndCertifications'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import {
  manageUserLicensesAndCertificationsFailed,
  manageUserLicensesAndCertificationsSuccess
} from 'store/actions/users/manageUserLicensesAndCertifications'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { checkErrorCode } from 'helpers/errorHandlers'

function* manageUserLicensesAndCertificationsReq({ payload }) {
  const { isDelete, isUpdate, licenseId, licenseData } = payload
  const accessToken = getCookie('accessToken')

  try {
    let response = null
    if (isDelete) {
      const deletePayload = {
        accessToken,
        licenseId
      }
      const { data } = yield call(deleteUserLicensesAndCertificationsService, deletePayload)
      response = data.data
    }

    if (isUpdate) {
      const updatePayload = {
        accessToken,
        licenseId,
        licenseData
      }
      const { data } = yield call(updateUserLicensesAndCertificationsService, updatePayload)
      response = data.data
    }

    if (!isDelete && !isUpdate) {
      const addPayload = {
        accessToken,
        licenseData: licenseData
      }
      const { data } = yield call(addUserLicensesAndCertificationsService, addPayload)
      response = data.data
    }

    yield put(manageUserLicensesAndCertificationsSuccess(response))

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
      yield put(manageUserLicensesAndCertificationsFailed(error))
    }
  }
}

export default function* manageUserLicensesAndCertificationsSaga() {
  yield takeLatest(MANAGE_USER_LICENSES_CERTIFICATIONS_REQUEST, manageUserLicensesAndCertificationsReq)
}