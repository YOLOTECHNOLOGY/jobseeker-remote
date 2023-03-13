import configuredAxios from 'helpers/configuredAxios'

const fetchJobsForYouLogin = (payload, accessToken=null) => {
  const {size,page, jobseekerPrefId,sort = '2'} = payload || {}
  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  return axios.get(`/job-preferences/${jobseekerPrefId}/reco-jobs?size=${size}&page=${page}&sort=${sort}`)
  
}

const fetchJobsPreferences = (payload, accessToken=null) => {
  const endpointType =  'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  return axios.get(`/job-preferences`)
  
}



export { fetchJobsForYouLogin,fetchJobsPreferences }