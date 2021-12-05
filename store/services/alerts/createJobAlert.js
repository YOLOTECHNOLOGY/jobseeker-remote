import configuredAxios from 'helpers/configuredAxios'

const createJobAlertService = (payload) => {
  const axios = configuredAxios('data', 'protected')
  return axios.post(`/subscribejob`, { ...payload })
}

export { createJobAlertService }
