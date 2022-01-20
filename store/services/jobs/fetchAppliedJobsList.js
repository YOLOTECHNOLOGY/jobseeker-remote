import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobsListService = (payload) => {
  const axios = configuredAxios('job', 'protected')

  return axios.get(`applied-jobs?${queryString.stringify(payload)}`)
}

export { fetchAppliedJobsListService }