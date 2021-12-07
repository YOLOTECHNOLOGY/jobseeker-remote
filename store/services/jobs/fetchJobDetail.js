// import CONFIG from 'shared/config'
import configuredAxios from 'helpers/configuredAxios'
// import { getCookie } from 'shared/helpers/cookies'

const fetchJobDetailService =(jobId) => {
//   if (!getCookie('user')) {
//     return axios.get(`${process.env.DATA_BOSSJOB_URL}/jobs/${payload}`)
//   } else {
    // pass in accessToken when user is logged in to track for 'who-view-job' feature
    const axios = configuredAxios('data', 'protected')
    return axios.get(`/jobs/${jobId}`)
//   }
}

export { fetchJobDetailService }