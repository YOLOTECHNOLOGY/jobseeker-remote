import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobsListService = (payload) => {
//   const axios = configuredAxios('search', 'public')
  const axios = configuredAxios('data', 'protected')

  return axios.get(`users/applied_jobs?${queryString.stringify(payload)}`)
}

export { fetchAppliedJobsListService }