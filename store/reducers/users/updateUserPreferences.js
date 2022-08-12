import {
    UPDATE_USER_PREFERENCES_REQUEST,
    UPDATE_USER_PREFERENCES_SUCCESS,
    UPDATE_USER_PREFERENCES_FAILED
} from 'store/types/users/updateUserPreferences'

const initialState = {
    fetching: false,
    response: {},
    error: null,
}

export default function updateUserPreferences(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USER_PREFERENCES_REQUEST:
            return {
                ...state,
                fetching: true,
            }
        case UPDATE_USER_PREFERENCES_SUCCESS:
            return {
                ...state,
                fetching: false,
                response: action.payload,
                error: null
            }
        case UPDATE_USER_PREFERENCES_FAILED:
            return {
                ...state,
                fetching: false,
                error: action.error,
                response: {},
            }
        default:
            return { ...state }
    }
}