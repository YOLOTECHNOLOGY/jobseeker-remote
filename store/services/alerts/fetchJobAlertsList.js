import configuredAxios from 'helpers/configuredAxios'

const fetchJobAlertsListService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.get(`/job-alerts`)
}

export { fetchJobAlertsListService }
