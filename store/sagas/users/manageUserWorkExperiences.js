/* Redux */
import { call, put, takeLatest } from 'redux-saga/effects'
import { MANAGE_USER_WORK_EXPERIENCES_REQUEST } from 'store/types/users/manageUserWorkExperiences'

import { addUserWorkExperienceService } from 'store/services/users/addUserWorkExperience'
import { deleteUserWorkExperienceService } from 'store/services/users/deleteUserWorkExperience'
import { updateUserWorkExperienceService } from 'store/services/users/updateUserWorkExperience'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { manageUserWorkExperiencesFailed, manageUserWorkExperiencesSuccess } from 'store/actions/users/manageUserWorkExperiences'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { checkErrorCode } from 'helpers/errorHandlers'

function* manageUserWorkExperiencesReq({ payload }) {
  const { isDelete, isUpdate, workExperienceId, workExperienceData } = payload
  const accessToken = getCookie('accessToken')

  try {
    let response = null
    if (isDelete) {
      const deletePayload = {
        accessToken,
        workExperienceId,
      }
      const { data } = yield call(deleteUserWorkExperienceService, deletePayload)
      response = data.data
    }

    if (isUpdate) {
      const updatePayload = {
        accessToken,
        workExperienceId,
        workExperienceData,
      }
      const { data } = yield call(updateUserWorkExperienceService, updatePayload)
      response = data.data
    }

    if (!isDelete && !isUpdate) {
      const addPayload = { accessToken, workExperience: workExperienceData }
      const { data } = yield call(addUserWorkExperienceService, addPayload)
      response = data.data
    }

    yield put(manageUserWorkExperiencesSuccess(response))

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
      yield put(manageUserWorkExperiencesFailed(error))
    }
  }
}

export default function* manageUserWorkExperiencesSaga() {
  yield takeLatest(MANAGE_USER_WORK_EXPERIENCES_REQUEST, manageUserWorkExperiencesReq)
}
