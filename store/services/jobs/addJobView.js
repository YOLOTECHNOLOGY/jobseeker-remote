import configuredAxios from 'helpers/configuredAxios'

const addJobViewService =(payload) => {
  const axios = configuredAxios('job', payload.status, false, payload.serverAccessToken)
  return axios.post(`/${payload.jobId}/view`)
}

export { addJobViewService }