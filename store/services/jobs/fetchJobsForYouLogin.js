import configuredAxios from 'helpers/configuredAxios'

const fetchJobsForYouLogin = (payload, accessToken = null) => {
  const { jobseekerPrefId } = payload || {}
  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  return axios.get(`/job-preferences/${jobseekerPrefId}/reco-jobs`, { params: payload })

}

const fetchJobsForYouDelete = (payload, accessToken = null) => {
  const { preferenceId, jobId } = payload || {}
  const axios = configuredAxios('job', 'protected', false, accessToken)
  return axios.delete(`/job-preferences/${preferenceId}/reco-jobs/${jobId}/delete`, { params: payload })

}

const fetchJobsPreferences = (payload, accessToken = null) => {
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  return axios.get(`/job-preferences`)

}



export { fetchJobsForYouLogin, fetchJobsPreferences, fetchJobsForYouDelete }