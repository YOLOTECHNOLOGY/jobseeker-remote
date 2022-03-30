import configuredAxios from 'helpers/configuredAxios'

const updateJobAlertService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.put(`/job-alerts/${payload.updateJobAlertData.id}/update`, { ...payload.updateJobAlertData })
}

export { updateJobAlertService }
