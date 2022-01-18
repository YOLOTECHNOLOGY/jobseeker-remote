import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchSavedJobsListService = (payload) => {
//   const axios = configuredAxios('search', 'public')
  const axios = configuredAxios('job', 'protected')

  return axios.get(`saved-jobs?${queryString.stringify(payload)}`)
}

export { fetchSavedJobsListService }