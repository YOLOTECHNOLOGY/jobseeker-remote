import { all, call, put, takeLatest } from 'redux-saga/effects'
import { UPDATE_USER_PREFERENCES_REQUEST } from 'store/types/users/updateUserPreferences'
import {
    updateUserPreferencesSuccess,
    updateUserPreferencesFailed,
} from 'store/actions/users/updateUserPreferences'
import { addUserPreferencesService, deleteUserPreferencesService } from 'store/services/users/addUserPreferences'
import { updateUserProfileService } from 'store/services/users/updateUserProfile'
import { updateUserProfileSuccess } from 'store/actions/users/updateUserProfile'
import { fetchUserOwnDetailRequest, fetchUserOwnDetailSuccess } from 'store/actions/users/fetchUserOwnDetail'

/* Helpers */
import { getCookie } from 'helpers/cookies'

function* updateUserPreferencesReq({ payload }) {
    try {
        const accessToken = getCookie('accessToken')
        const { preferences, profile } = payload
        console.log('update', payload)
        const preferencesPayload = {
            accessToken,
            preferences
        }

        let preferenceResponse;
        let userUpdateProfileResponse;
        if (preferences) {
            switch (preferences.action) {
                case 'delete': {
                    preferenceResponse = yield call(deleteUserPreferencesService, preferences)
                    if (preferenceResponse?.data?.data?.message === "success") {
                        yield put(fetchUserOwnDetailRequest({ accessToken }))
                        yield put(updateUserPreferencesSuccess(preferenceResponse.data.data))
                    } else {
                        yield put(updateUserPreferencesFailed(preferenceResponse.data.data))
                    }

                }
            }
        }
        if (profile) {
            userUpdateProfileResponse = yield call(updateUserProfileService, profile)
            yield put(updateUserProfileSuccess(userUpdateProfileResponse.data.data))
            yield put(fetchUserOwnDetailSuccess(userUpdateProfileResponse.data.data))
            yield put(updateUserPreferencesSuccess(userUpdateProfileResponse.data.data))
        }
        // [preferenceResponse, userUpdateProfileResponse] = yield all([
        //     call(addUserPreferencesService, preferencesPayload),
        //     call(updateUserProfileService, profile)
        // ])


        // yield put(fetchUserOwnDetailRequest({ accessToken }))
    } catch (error) {
        yield put(updateUserPreferencesFailed(error.response))
    }
}

export default function* updateUserPreferencesSaga() {
    yield takeLatest(UPDATE_USER_PREFERENCES_REQUEST, updateUserPreferencesReq)
}