import configuredAxios from 'helpers/configuredAxios'

const updateJobAlertService = (payload) => {
  const axios = configuredAxios('job', 'protected')
  return axios.put(`/job-alerts/${payload.id}/update`, { ...payload })
}

export { updateJobAlertService }
