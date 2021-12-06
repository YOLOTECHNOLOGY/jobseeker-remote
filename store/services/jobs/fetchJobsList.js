import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsListService = (payload) => {
//   const axios = configuredAxios('search', 'public')
  const axios = configuredAxios('search', 'public')

  return axios.get(`search/job_filter?${queryString.stringify(payload)}`)
}

export { fetchJobsListService }