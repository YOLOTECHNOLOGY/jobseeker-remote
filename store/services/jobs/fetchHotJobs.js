import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchHotJobsListService = (payload, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('job', endpointType, false, accessToken)

  return axios.get(`hot-company-jobs?${queryString.stringify(payload)}`)
}

export { fetchHotJobsListService }
