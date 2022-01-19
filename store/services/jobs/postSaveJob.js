import configuredAxios from 'helpers/configuredAxios'

const postSaveJobService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.post('saved-jobs/create', {...payload})
}

export { postSaveJobService }