import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobsListService = (payload) => {
  const axios = configuredAxios('jobApplication', 'protected', '', payload.accessToken)

  return axios.get(`jobseekers?${queryString.stringify(payload)}`)
}

export { fetchAppliedJobsListService }
