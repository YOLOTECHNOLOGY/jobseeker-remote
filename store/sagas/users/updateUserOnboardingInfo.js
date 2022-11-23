import { all, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { UPDATE_USER_ONBOARDING_INFO_REQUEST } from 'store/types/users/updateUserOnboardingInfo'
import { getCookie, setCookie } from 'helpers/cookies'
import {
  updateUserProfileSuccess,
  updateUserProfileFailed
} from 'store/actions/users/updateUserProfile'
import {
  fetchUserWorkExperienceSuccess,
  fetchUserWorkExperienceFailed
} from 'store/actions/users/fetchUserWorkExperience'
import {
  fetchUserEducationSuccess,
  fetchUserEducationFailed
} from 'store/actions/users/fetchUserEducation'

import {
  completeUserProfileSuccess,
  completeUserProfileFailed
} from 'store/actions/users/completeUserProfile'

import { updateUserProfileService } from 'store/services/users/updateUserProfile'
import { createUserPreferencesService, updateUserPreferencesService } from 'store/services/users/addUserPreferences'
import { completeUserProfileService } from 'store/services/users/completeUserProfile'

import { fetchUserWorkExperienceService } from 'store/services/users/fetchUserWorkExperience'
import { addUserWorkExperienceService } from 'store/services/users/addUserWorkExperience'
import { deleteUserWorkExperienceService } from 'store/services/users/deleteUserWorkExperience'
import { updateUserWorkExperienceService } from 'store/services/users/updateUserWorkExperience'

import { fetchUserEducationService } from 'store/services/users/fetchUserEducation'
import { addUserEducationService } from 'store/services/users/addUserEducation'
import { deleteUserEducationService } from 'store/services/users/deleteUserEducation'
import { updateUserEducationService } from 'store/services/users/updateUserEducation'

import { getItem, removeItem } from 'helpers/localStorage'

import { checkErrorCode } from 'helpers/errorHandlers'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

function* updateUserOnboardingInfoReq({ payload }) {
  const isFromCreateResume = getItem('isFromCreateResume')
  const quickUpladResumeType = getItem('quickUpladResume')

  const {
    preferenceId,
    preferences,
    profile,
    accessToken,
    isDelete,
    isUpdate,
    workExperienceId,
    workExperienceData,
    educationId,
    educationData,
    currentStep,
    redirect,
    proceedingPath
  } = payload

  try {
    if (currentStep === 1) {
      const preferencesPayload = {
        preferenceId,
        accessToken,
        params: preferences
      }
      const [preferenceResponse, userCompleteProfileResponse] = yield all([
        call((preferenceId ? updateUserPreferencesService : createUserPreferencesService), preferencesPayload),
        call(updateUserProfileService, profile)
      ])

      yield put(updateUserProfileSuccess(userCompleteProfileResponse.data.data))
      let url = '/jobseeker-complete-profile/10'

      if (redirect) {
        url = `/jobseeker-complete-profile/10?redirect=${redirect}`
      }

      if (isFromCreateResume && isFromCreateResume === '1') {
        url = '/jobseeker-complete-profile/1101'
      }

      if (quickUpladResumeType) {
        url = '/jobseeker-complete-profile/1101'
      }

      yield put(push(url))
    }

    if (currentStep === 3) {
      if (isDelete) {
        const deletePayload = {
          accessToken,
          workExperienceId
        }
        yield call(deleteUserWorkExperienceService, deletePayload)
      }

      if (isUpdate) {
        const updatePayload = {
          accessToken,
          workExperienceId,
          workExperienceData
        }
        yield call(updateUserWorkExperienceService, updatePayload)
      }

      if (!isDelete && !isUpdate) {
        const payload = { accessToken, workExperience: workExperienceData }
        yield call(addUserWorkExperienceService, payload)
        if (proceedingPath) {
          yield put(push(proceedingPath))
        }
      }

      yield fetchUserWorkExperienceSaga(accessToken)
    }

    if (currentStep === 4) {
      if (!isDelete && !isUpdate) {
        const payload = { accessToken, educationData }
        yield call(addUserEducationService, payload)
      }

      if (isDelete) {
        const deletePayload = {
          accessToken,
          educationId
        }
        yield call(deleteUserEducationService, deletePayload)
      }

      if (isUpdate) {
        const updatePayload = {
          accessToken,
          educationId,
          educationData
        }
        yield call(updateUserEducationService, updatePayload)
      }

      yield fetchUserEducationServiceSaga(accessToken)
    }

    if (currentStep === 5) {
      yield completeUserProfileSaga(redirect, accessToken)
    }
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
      yield put(updateUserProfileFailed(error))
    }
  }
}

function* fetchUserWorkExperienceSaga(accessToken) {
  try {
    const { data } = yield call(fetchUserWorkExperienceService, { accessToken })
    yield put(fetchUserWorkExperienceSuccess(data.data))
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
      yield put(fetchUserWorkExperienceFailed(error))
    }
  }
}

function* fetchUserEducationServiceSaga(accessToken) {
  try {
    const { data } = yield call(fetchUserEducationService, { accessToken })
    yield put(fetchUserEducationSuccess(data.data))
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
      yield put(fetchUserEducationFailed(error))
    }
  }
}

function* completeUserProfileSaga(redirect, accessToken) {
  try {
    const { data } = yield call(completeUserProfileService, { accessToken })
    yield put(completeUserProfileSuccess(data.data))
    const userCookie = getCookie('user')
    const accessToken = getCookie('accessToken')

    userCookie.is_profile_completed = true

    yield call(setCookie, 'user', userCookie)

    let url = '/jobs-hiring/job-search'

    if (redirect) {
      url = redirect
    }

    removeItem('isFromCreateResume')
    removeItem('isCreateFreeResume')
    removeItem('quickUpladResume')
    removeItem('isRegisterModuleRedirect')
    yield put(push(url))
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
      yield put(completeUserProfileFailed(error))
    }
  }
}

export default function* updateUserOnboardingInfoSaga() {
  yield takeLatest(UPDATE_USER_ONBOARDING_INFO_REQUEST, updateUserOnboardingInfoReq)
}
