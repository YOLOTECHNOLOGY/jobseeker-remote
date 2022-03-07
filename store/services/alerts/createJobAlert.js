import configuredAxios from 'helpers/configuredAxios'

const createJobAlertService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.post(`/job-alerts/create`, { ...payload.jobAlertData })
}

export { createJobAlertService }
