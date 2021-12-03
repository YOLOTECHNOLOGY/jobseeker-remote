import configuredAxios from 'helpers/configuredAxios'

const deleteJobAlertService = ({userId}) => {
  const axios = configuredAxios('data', 'public')
  return axios.delete(`/api/v2/subscribejob/${userId}`)
}

export { deleteJobAlertService }
