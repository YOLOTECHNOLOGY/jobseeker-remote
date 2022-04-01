import configuredAxios from 'helpers/configuredAxios'

const deleteSaveJobService = (jobId) => {
  const axios = configuredAxios('job', 'protected')
  return axios.delete(`saved-jobs/${jobId}/delete`)
}

export { deleteSaveJobService }