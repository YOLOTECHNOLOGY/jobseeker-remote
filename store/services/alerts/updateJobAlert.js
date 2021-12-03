import configuredAxios from 'helpers/configuredAxios'

const updateJobAlertService = ({userId}) => {
  const axios = configuredAxios('data', 'public')
  return axios.put(`/api/v2/subscribejob/${userId}`)
}

export { updateJobAlertService }
