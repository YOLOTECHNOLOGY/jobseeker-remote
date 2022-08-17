import configuredAxios from 'helpers/configuredAxios'

const updateUserLicensesAndCertificationsService = (payload) => {
	const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

	return axios.patch(`/license-certifications/${payload.licenseId}/update`, {...payload.licenseData})
}

export { updateUserLicensesAndCertificationsService }