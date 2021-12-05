import configuredAxios from 'helpers/configuredAxios'

const deleteJobAlertService = (jobAlertId) => {
  const axios = configuredAxios('data', 'protected')
  return axios.delete(`/subscribejob/${jobAlertId}`)
}

export { deleteJobAlertService }
