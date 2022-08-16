import {
	MANAGE_USER_LICENSES_CERTIFICATIONS_REQUEST,
	MANAGE_USER_LICENSES_CERTIFICATIONS_SUCCESS,
	MANAGE_USER_LICENSES_CERTIFICATIONS_FAILED
} from 'store/types/users/manageUserLicensesAndCertifications'

const manageUserLicensesAndCertificationsRequest = (payload) => ({
	type: MANAGE_USER_LICENSES_CERTIFICATIONS_REQUEST,
	payload,
})

const manageUserLicensesAndCertificationsSuccess = (payload) => ({
	type: MANAGE_USER_LICENSES_CERTIFICATIONS_SUCCESS,
	payload,
})

const manageUserLicensesAndCertificationsFailed = (error) => ({
	type: MANAGE_USER_LICENSES_CERTIFICATIONS_FAILED,
	error,
})

export {
	manageUserLicensesAndCertificationsRequest,
	manageUserLicensesAndCertificationsSuccess,
	manageUserLicensesAndCertificationsFailed
}