// import CONFIG from 'shared/config'
import configuredAxios from 'helpers/configuredAxios'
// import { getCookie } from 'shared/helpers/cookies'

const fetchJobDetailService = (payload) => {
  const axios = configuredAxios('job', payload.status, false, payload.serverAccessToken)
  return axios.get(`/${payload.jobId}`)
}

export { fetchJobDetailService }
