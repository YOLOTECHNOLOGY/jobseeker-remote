import configuredAxios from 'helpers/configuredAxios'

const addExternalJobClickService =(jobId) => {
  const axios = configuredAxios('job')

  return axios.post(`/${jobId}/click-external-job`)
}

export { addExternalJobClickService }