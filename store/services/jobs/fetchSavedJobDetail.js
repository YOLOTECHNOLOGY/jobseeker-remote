import configuredAxios from 'helpers/configuredAxios'

const fetchSavedJobDetailService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.get(`/saved-jobs/${payload.savedJobId}`)
}

export { fetchSavedJobDetailService }