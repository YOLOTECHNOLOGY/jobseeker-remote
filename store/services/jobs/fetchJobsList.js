import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsListService = (payload, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('job', endpointType, false, accessToken)

  return axios.get(`search?${queryString.stringify(payload)}`)
}

const fetchRemoteJobsListService = (payload, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('job', endpointType, false, accessToken)

  return axios.get(`search-remote-jobs?${queryString.stringify(payload)}`)
}

const fetchHotJobsListService = (countryId, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('recommendation', endpointType, false, accessToken)

  return axios.get(`/hot-jobs?page=1&size=15&country_id=${countryId}`)
}
const queryOnlineStatus = (user_ids, accessToken, role = 'recruiter') => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('jobApplication', endpointType, false, accessToken)

  return axios.post('chats/tmm/query-online-status', {
    user_ids,
    role
  })
}

export {
  fetchJobsListService,
  fetchHotJobsListService,
  queryOnlineStatus,
  fetchRemoteJobsListService
}
