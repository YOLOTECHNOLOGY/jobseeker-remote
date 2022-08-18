import configuredAxios from 'helpers/configuredAxios'

const addUserLicensesAndCertificationsService = (payload) => {
	const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/license-certifications/create', {...payload.licenseData})
}

export { addUserLicensesAndCertificationsService }
