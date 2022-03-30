import configuredAxios from 'helpers/configuredAxios'

const fetchSimilarJobsService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`/${payload.jobId}/similar_jobs`)
}

export { fetchSimilarJobsService }