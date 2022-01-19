import configuredAxios from 'helpers/configuredAxios'

const createJobAlertService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.post(`/job-alerts/create`, { ...payload })
}

export { createJobAlertService }
