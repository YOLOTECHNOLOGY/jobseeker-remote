import configuredAxios from 'helpers/configuredAxios'

const fetchSimilarJobsService = (payload) => {
  const axios = configuredAxios('job', 'public')
  return axios.get(`/jobs/${payload.jobId}/similar-jobs`)
}

export { fetchSimilarJobsService }