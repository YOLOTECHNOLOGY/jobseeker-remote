import { all, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { UPDATE_USER_COMPLETE_PROFILE_REQUEST } from 'store/types/users/updateUserCompleteProfile'
import { getCookie, setCookie } from 'helpers/cookies'
import {
  updateUserCompleteProfileSuccess,
  updateUserCompleteProfileFailed,
} from 'store/actions/users/updateUserCompleteProfile'
import {
  fetchUserWorkExperienceSuccess,
  fetchUserWorkExperienceFailed,
} from 'store/actions/users/fetchUserWorkExperience'
import {
  fetchUserEducationSuccess,
  fetchUserEducationFailed,
} from 'store/actions/users/fetchUserEducation'

import {
  completeUserProfileSuccess,
  completeUserProfileFailed,
} from 'store/actions/users/completeUserProfile'

import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'
import { addUserPreferencesService } from 'store/services/users/addUserPreferences'
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

function* updateUserCompleteProfileReq({ payload }) {
  const isFromCreateResume = getItem('isFromCreateResume')

  const { 
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
    proceedingPath,
  } = payload

  try {
    if (currentStep === 1) {
      const profilePayload = {
        accessToken,
        profile
      }
      const preferencesPayload = {
        accessToken,
        preferences
      }

      let preferenceResponse, userCompleteProfileResponse
      [preferenceResponse, userCompleteProfileResponse] = yield all([
        call(addUserPreferencesService, preferencesPayload),
        call(updateUserCompleteProfileService, profilePayload)
      ])

      yield put(updateUserCompleteProfileSuccess(userCompleteProfileResponse.data.data))
      let url = '/jobseeker-complete-profile/10'

      if (redirect) {
        url = `/jobseeker-complete-profile/10?redirect=${redirect}`
      }

      if (isFromCreateResume && isFromCreateResume === '1') {
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
        const payload = { accessToken, workExperience: workExperienceData}
        yield call(addUserWorkExperienceService, payload)
        if (proceedingPath) {

          yield put(push(proceedingPath))
        }
      }
      
      yield fetchUserWorkExperienceSaga(accessToken)
    }

    if (currentStep === 4) {
      if (!isDelete && !isUpdate) {
        const payload = { accessToken, educationData}
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
    yield put(updateUserCompleteProfileFailed(error))
  }
}

function* fetchUserWorkExperienceSaga(accessToken) {
  try {
    const { data } = yield call(fetchUserWorkExperienceService, {accessToken})
    yield put(fetchUserWorkExperienceSuccess(data.data))
  } catch (error) {
    yield put(fetchUserWorkExperienceFailed(error))
  }
}

function* fetchUserEducationServiceSaga(accessToken) {
  try {
    const { data } = yield call(fetchUserEducationService, {accessToken})
    yield put(fetchUserEducationSuccess(data.data))
  } catch (error) {
    yield put(fetchUserEducationFailed(error))
  }
}

function* completeUserProfileSaga(redirect, accessToken) {
  try {
    const { data } = yield call(completeUserProfileService, { accessToken })
    yield put(completeUserProfileSuccess(data.data))

    let userCookie = getCookie('user')

    userCookie.is_profile_completed = true
    
    yield call(setCookie, 'user', userCookie)

    let url = '/jobs-hiring/job-search'
    if (redirect) {
      url = redirect
    }

    removeItem('isFromCreateResume')
    removeItem('isCreateFreeResume')
    yield put(push(url))
  } catch (error) {
    yield put(completeUserProfileFailed(error))
  }
}

export default function* updateUserCompleteProfileSaga() {
  yield takeLatest(UPDATE_USER_COMPLETE_PROFILE_REQUEST, updateUserCompleteProfileReq)
}
