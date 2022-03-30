import configuredAxios from 'helpers/configuredAxios'

const deleteSaveJobService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.delete(`saved-jobs/${payload.savedJobId}/delete`)
}

export { deleteSaveJobService }