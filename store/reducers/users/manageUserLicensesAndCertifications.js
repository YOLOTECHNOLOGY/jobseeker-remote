import {
	MANAGE_USER_LICENSES_CERTIFICATIONS_REQUEST,
	MANAGE_USER_LICENSES_CERTIFICATIONS_SUCCESS,
	MANAGE_USER_LICENSES_CERTIFICATIONS_FAILED
} from 'store/types/users/manageUserLicensesAndCertifications'

const initialState = {
	fetching: false,
	response: {},
	error: null
}

export default function manageUserLicensesAndCertifications(state = initialState, action) {
	switch (action.type) {
		case MANAGE_USER_LICENSES_CERTIFICATIONS_REQUEST:
				return {
						...state,
						fetching: true
				}
		case MANAGE_USER_LICENSES_CERTIFICATIONS_SUCCESS:
				return {
						...state,
						fetching: false,
						response: action.payload,
						error: null
				}
		case MANAGE_USER_LICENSES_CERTIFICATIONS_FAILED:
				return {
						...state,
						fetching: false,
						error: action.error,
						response: {}
				}
		default:
				return { ...state }
  }
}