// import CONFIG from 'shared/config'
import configuredAxios from 'helpers/configuredAxios'
// import { getCookie } from 'shared/helpers/cookies'
import { cache } from 'react'
const fetchJobDetailService = cache((payload) => {
  const axios = configuredAxios('job', payload.status, false, payload.serverAccessToken)
  return axios.get(`/${payload.jobId}`)
 }
)
export { fetchJobDetailService }
