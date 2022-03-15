import configuredAxios from 'helpers/configuredAxios'

const deleteJobAlertService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)
  return axios.delete(`/job-alerts/${payload.jobAlertId}/delete`)
}

export { deleteJobAlertService }
