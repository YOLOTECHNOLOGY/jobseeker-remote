import configuredAxios from 'helpers/configuredAxios'

const applyJobService = (jobId, payload) => {
  const axios = configuredAxios('job', 'protected')

  return axios.post(`/${jobId}/apply`, payload)
}

export { applyJobService }