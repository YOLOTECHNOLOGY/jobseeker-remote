import configuredAxios from 'helpers/configuredAxios'

const fetchSimilarJobsService = (payload, serverAccessToken) => {
  const axios = configuredAxios('job', 'protected', undefined, serverAccessToken)
  return axios.get(`/similar?size=${payload.size}&job_id=${payload.jobId}`)
}

export { fetchSimilarJobsService }