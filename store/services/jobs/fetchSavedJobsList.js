import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchSavedJobsListService = (payload) => {
//   const axios = configuredAxios('search', 'public')
  const axios = configuredAxios('data', 'protected')

  return axios.get(`users/${payload.userId}/saved_jobs?${queryString.stringify(payload)}`)
}

export { fetchSavedJobsListService }