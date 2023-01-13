import configuredAxios from 'helpers/configuredAxios'

const addExternalJobClickService = (jobId) => {
  const axios = configuredAxios('job', 'protected')

  return axios.post(`/${jobId}/click-external-job`)
}

export { addExternalJobClickService }
