import configuredAxios from 'helpers/configuredAxios'

const deleteSaveJobService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.delete(`saved-jobs/${payload.saveJobId}/delete`)
}

export { deleteSaveJobService }