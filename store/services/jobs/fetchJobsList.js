import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsListService = (payload, accessToken=null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('job', endpointType, false, accessToken)
  
  return axios.get(`filter?${queryString.stringify(payload)}`)
}

export { fetchJobsListService }