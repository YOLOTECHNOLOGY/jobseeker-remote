import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsForYou = (payload, accessToken=null) => {

  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  //return axios.get(`/job-preferences/1717050/reco-jobs?size=${size}&page=${page}`)
  return axios.get(`/popular-jobs?${queryString.stringify(payload)}`)
 
}

export { fetchJobsForYou }