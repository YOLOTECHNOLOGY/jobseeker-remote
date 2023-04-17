import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsForYou = (payload, accessToken=null) => {

  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  // return axios.get(`/filter?${queryString.stringify(payload)}`)
  return axios.get(`/search?${queryString.stringify(payload)}`)
}

export { fetchJobsForYou }