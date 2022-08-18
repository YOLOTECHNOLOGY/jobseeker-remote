import configuredAxios from 'helpers/configuredAxios'

const deleteUserLicensesAndCertificationsService = (payload) => {
	const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)
	
	return axios.delete(`/license-certifications/${payload.licenseId}/delete`)
}

export { deleteUserLicensesAndCertificationsService }