import { memoizeWithTime } from 'helpers/cache'
import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'
const fetchPopularJobs = memoizeWithTime((params) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/popular-remote-jobs`, { params })
},
  params => JSON.stringify(params),
  3600
)


const fetchSearchRemoteSuggestionService = (payload, token = '') => {
  const axios = configuredAxios('job', token ? 'protected' : 'public')
  return axios.get(`/search-remote-suggestion?${queryString.stringify(payload)}`)
}

export { fetchPopularJobs, fetchSearchRemoteSuggestionService }
