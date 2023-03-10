import configuredAxios from 'helpers/configuredAxios'

const fetchJobsForYouLogin = (payload, accessToken=null) => {
  const {size,page, jobseekerPrefId} = payload || {}
  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  return axios.get(`/job-preferences/${jobseekerPrefId}/reco-jobs?size=${size}&page=${page}`)
  
}

const fetchJobsPreferences = (payload, accessToken=null) => {
  const endpointType =  'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  return axios.get(`/job-preferences`)
  
}



export { fetchJobsForYouLogin,fetchJobsPreferences }