import configuredAxios from 'helpers/configuredAxios'

const fetchJobsForYouLogin = (payload, accessToken = null) => {
  const { jobseekerPrefId } = payload || {}
  const endpointType = accessToken ? 'protected' : 'public'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  // return axios.get(`/job-preferences/${jobseekerPrefId}/reco-jobs`, { params: rest })
  delete payload?.jobseekerPrefId
  return axios.get(`/reco`, { params: { ...payload, job_preference_id: jobseekerPrefId } })
}

const fetchJobsForYouDelete = (payload, accessToken = null) => {
  const { job_preference_id, job_id, ...rest } = payload || {}
  const axios = configuredAxios('job', 'protected', false, accessToken)
  return axios.delete(`/job-preferences/${job_preference_id}/reco-jobs/${job_id}/delete`, { params: rest })

}

const fetchJobsPreferences = (payload, accessToken = null) => {
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  return axios.get(`/job-preferences`)

}



export { fetchJobsForYouLogin, fetchJobsPreferences, fetchJobsForYouDelete }