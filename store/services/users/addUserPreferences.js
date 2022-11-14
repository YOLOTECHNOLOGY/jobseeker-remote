import configuredAxios from 'helpers/configuredAxios'

const addUserPreferencesService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/job-preferences/update', {...payload.preferences})
}
const deleteUserPreferencesService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.delete(`/job-preferences/${payload.preferenceId}/delete`)
}
export { addUserPreferencesService,deleteUserPreferencesService }
