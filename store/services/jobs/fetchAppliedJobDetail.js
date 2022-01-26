import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobDetailService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/applied-jobs/${payload.appliedJobId}`)
}

export { fetchAppliedJobDetailService }