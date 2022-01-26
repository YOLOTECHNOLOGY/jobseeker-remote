import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsListService = (payload) => {
//   const axios = configuredAxios('search', 'public')
  const axios = configuredAxios('job', 'public')
  return axios.get(`jobs/filter?${queryString.stringify(payload)}`)
}

export { fetchJobsListService }