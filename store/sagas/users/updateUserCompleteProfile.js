import { all, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { UPDATE_USER_COMPLETE_PROFILE_REQUEST } from 'store/types/users/updateUserCompleteProfile'
import {
  updateUserCompleteProfileSuccess,
  updateUserCompleteProfileFailed,
} from 'store/actions/users/updateUserCompleteProfile'
import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'
import { addUserPreferencesService } from 'store/services/users/addUserPreferences'

function* updateUserCompleteProfileReq({ payload }) {
  const { preferences, profile, accessToken, currentStep } = payload

  try {
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
  } catch (error) {
    yield put(updateUserCompleteProfileFailed(error))
  }
}

export default function* updateUserCompleteProfileSaga() {
  yield takeLatest(UPDATE_USER_COMPLETE_PROFILE_REQUEST, updateUserCompleteProfileReq)
}
