import configuredAxios from 'helpers/configuredAxios'

const withdrawAppliedJobService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.patch(`applied-jobs/${payload.appliedJobId}/withdraw`)
}

export { withdrawAppliedJobService }