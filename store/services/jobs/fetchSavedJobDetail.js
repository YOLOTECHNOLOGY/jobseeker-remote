import configuredAxios from 'helpers/configuredAxios'

const fetchSavedJobDetailService = (jobId) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/saved-jobs/${jobId}`)
}

export { fetchSavedJobDetailService }