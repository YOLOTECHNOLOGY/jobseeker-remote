import configuredAxios from 'helpers/configuredAxios'

const fetchSimilarJobsService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/${payload.jobId}/similar-jobs?size=${payload.size}`)
}

export { fetchSimilarJobsService }