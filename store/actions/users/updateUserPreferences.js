import {
    UPDATE_USER_PREFERENCES_REQUEST,
    UPDATE_USER_PREFERENCES_SUCCESS,
    UPDATE_USER_PREFERENCES_FAILED
} from 'store/types/users/updateUserPreferences'

const updateUserPreferencesRequest = (payload) => ({
    type: UPDATE_USER_PREFERENCES_REQUEST,
    payload,
})

const updateUserPreferencesSuccess = (payload) => ({
    type: UPDATE_USER_PREFERENCES_SUCCESS,
    payload,
})

const updateUserPreferencesFailed = (error) => ({
    type: UPDATE_USER_PREFERENCES_FAILED,
    error,
})

export {
    updateUserPreferencesRequest,
    updateUserPreferencesSuccess,
    updateUserPreferencesFailed
}