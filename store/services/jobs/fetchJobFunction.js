import configuredAxios from 'helpers/configuredAxios'

const fetchJobsFunction = (company_id) => {

	const axios = configuredAxios('job', 'public')

	return axios.get(`/${company_id}/job-function`)
}

export { fetchJobsFunction }
