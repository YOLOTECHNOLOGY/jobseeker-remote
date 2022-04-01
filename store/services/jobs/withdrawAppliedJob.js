import configuredAxios from 'helpers/configuredAxios'

const withdrawAppliedJobService = (jobId) => {
  const axios = configuredAxios('job', 'protected')
  return axios.patch(`applied-jobs/${jobId}/withdraw`)
}

export { withdrawAppliedJobService }