import { all, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { UPDATE_USER_COMPLETE_PROFILE_REQUEST } from 'store/types/users/updateUserCompleteProfile'
import {
  updateUserCompleteProfileSuccess,
  updateUserCompleteProfileFailed,
} from 'store/actions/users/updateUserCompleteProfile'
import {
  fetchUserWorkExperienceSuccess,
  fetchUserWorkExperienceFailed,
} from 'store/actions/users/fetchUserWorkExperience'

import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'
import { addUserPreferencesService } from 'store/services/users/addUserPreferences'
import { fetchUserWorkExperienceService } from 'store/services/users/fetchUserWorkExperience'
import { addUserWorkExperienceService } from 'store/services/users/addUserWorkExperience'
import { deleteUserWorkExperienceService } from 'store/services/users/deleteUserWorkExperience'
import { updateUserWorkExperienceService } from 'store/services/users/updateUserWorkExperience'

function* updateUserCompleteProfileReq({ payload }) {
  const { 
    preferences, 
    profile, 
    accessToken, 
    workExperiences,
    isDelete,
    workExperienceId,
    currentStep 
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
      yield put(push('/jobseeker-complete-profile/10'))
    }

    if (currentStep === 3) {
      console.log('currentStep is 3')

      if (isDelete) {
        const deletePayload = {
          accessToken,
          workExperienceId
        }
        yield call(deleteUserWorkExperienceService, deletePayload)

        yield fetchUserWorkExperienceSaga(accessToken)
      }
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

export default function* updateUserCompleteProfileSaga() {
  yield takeLatest(UPDATE_USER_COMPLETE_PROFILE_REQUEST, updateUserCompleteProfileReq)
}
