import configuredAxios from 'helpers/configuredAxios'

const fetchJobAlertsListService = (userId) => {
  const axios = configuredAxios('data', 'protected')
  return axios.get(`/subscribejob/${userId}/user`)
}

export { fetchJobAlertsListService }
