import configuredAxios from 'helpers/configuredAxios'

const applyJobService = (jobId, payload) => {
  const axios = configuredAxios('data', 'protected')

  return axios.post(`jobs/${jobId}/applications`, payload)
}

export { applyJobService }