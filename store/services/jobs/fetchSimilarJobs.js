import configuredAxios from 'helpers/configuredAxios'

const fetchSimilarJobsService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/similar?size=${payload.size}&job_id=${payload.jobId}`)
}

export { fetchSimilarJobsService }