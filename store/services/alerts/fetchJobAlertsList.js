import configuredAxios from 'helpers/configuredAxios'

const fetchJobAlertsListService = ({userId}) => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`/subscribejob/${userId}/user/`)
}

export { fetchJobAlertsListService }
