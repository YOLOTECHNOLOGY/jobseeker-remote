import configuredAxios from 'helpers/configuredAxios'

const updateJobAlertService = (payload) => {
  const axios = configuredAxios('data', 'protected')
  return axios.put(`/subscribejob/${payload.id}`, { ...payload })
}

export { updateJobAlertService }
