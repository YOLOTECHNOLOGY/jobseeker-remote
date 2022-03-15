import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchSavedJobsListService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.get(`/saved-jobs?${queryString.stringify(payload)}`)
}

export { fetchSavedJobsListService }