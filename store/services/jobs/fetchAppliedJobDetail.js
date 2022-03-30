import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobDetailService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.get(`/applied-jobs/${payload.appliedJobId}`)
}

export { fetchAppliedJobDetailService }