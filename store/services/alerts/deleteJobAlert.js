import configuredAxios from 'helpers/configuredAxios'

const deleteJobAlertService = (jobAlertId) => {
  const axios = configuredAxios('job', 'protected')
  return axios.delete(`/job-alerts/${jobAlertId}/delete`)
}

export { deleteJobAlertService }
