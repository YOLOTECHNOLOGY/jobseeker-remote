import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'
import { memoizeWithTime } from 'helpers/cache'

const fetchJobsForYou = memoizeWithTime((payload, accessToken = null) => {

  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  // return axios.get(`/filter?${queryString.stringify(payload)}`)
  return axios.get(`/search?${queryString.stringify(payload)}`)
},
  (payload, accessToken) => JSON.stringify(payload) + accessToken,
  3600
)

export { fetchJobsForYou }