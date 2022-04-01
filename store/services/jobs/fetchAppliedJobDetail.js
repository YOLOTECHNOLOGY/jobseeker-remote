import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobDetailService = (jobId) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/applied-jobs/${jobId}`)
}

export { fetchAppliedJobDetailService }