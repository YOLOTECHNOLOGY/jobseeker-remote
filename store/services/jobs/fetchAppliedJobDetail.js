import configuredAxios from 'helpers/configuredAxios'

const fetchAppliedJobDetailService = (jobId, serverAccessToken=null) => {
  const axios = configuredAxios('job', 'protected', false, serverAccessToken)
  
  return axios.get(`/applied-jobs/${jobId}`)
}

export { fetchAppliedJobDetailService }