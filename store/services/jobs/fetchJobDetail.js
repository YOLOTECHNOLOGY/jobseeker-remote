// import CONFIG from 'shared/config'
import configuredAxios from 'helpers/configuredAxios'
// import { getCookie } from 'shared/helpers/cookies'

const fetchJobDetailService = (payload) => {
  const axios = configuredAxios('job')
  console.log(payload, '=======[][')
  return axios.get(`/${payload.jobId}`)
}

export { fetchJobDetailService }
