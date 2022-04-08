import configuredAxios from 'helpers/configuredAxios'

const fetchSimilarJobsService = (payload) => {
  const axios = configuredAxios('job', 'public')
  return axios.get(`/${payload.jobId}/similar-jobs?size=5`)
}

export { fetchSimilarJobsService }