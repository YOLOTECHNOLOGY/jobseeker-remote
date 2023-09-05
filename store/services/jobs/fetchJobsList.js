import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsListService = (payload, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('job', endpointType, false, accessToken)

  return axios.get(`search?${queryString.stringify(payload)}`)
}
const fetchHotJobsListService = (countryId, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('recommendation', endpointType, false, accessToken)

  return axios.get(`/hot-jobs?page=1&size=1&country_id=${countryId}`)
}

export { fetchJobsListService, fetchHotJobsListService }
