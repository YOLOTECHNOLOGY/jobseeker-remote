import { all, call, put, takeLatest } from 'redux-saga/effects'
import { UPDATE_USER_PREFERENCES_REQUEST } from 'store/types/users/updateUserPreferences'
import {
    updateUserPreferencesSuccess,
    updateUserPreferencesFailed,
} from 'store/actions/users/updateUserPreferences'
import { addUserPreferencesService } from 'store/services/users/addUserPreferences'
import { updateUserProfileService } from 'store/services/users/updateUserProfile'
import { updateUserProfileSuccess } from 'store/actions/users/updateUserProfile'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

/* Helpers */
import { getCookie } from 'helpers/cookies'

function* updateUserPreferencesReq({ payload }) {
    try {
        const accessToken = getCookie('accessToken')
        const { preferences, profile } = payload

        const preferencesPayload = {
            accessToken,
            preferences
        }

        let preferenceResponse, userUpdateProfileResponse;

        [preferenceResponse, userUpdateProfileResponse] = yield all([
            call(addUserPreferencesService, preferencesPayload),
            call(updateUserProfileService, profile)
        ])

        yield put(updateUserPreferencesSuccess(preferenceResponse.data.data)),
        yield put(updateUserProfileSuccess(userUpdateProfileResponse.data.data))

        yield put(fetchUserOwnDetailRequest({ accessToken }))
    } catch (error) {
        yield put(updateUserPreferencesFailed(error.response))
    }
}

export default function* updateUserPreferencesSaga() {
    yield takeLatest(UPDATE_USER_PREFERENCES_REQUEST, updateUserPreferencesReq)
}