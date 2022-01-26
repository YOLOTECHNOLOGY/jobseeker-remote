import configuredAxios from 'helpers/configuredAxios'

const fetchJobAlertsListService = (userId) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/job-alerts`)
}

export { fetchJobAlertsListService }
