import configuredAxios from 'helpers/configuredAxios'

const fetchSavedJobDetailService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/saved-jobs/${payload.savedJobId}`)
}

export { fetchSavedJobDetailService }