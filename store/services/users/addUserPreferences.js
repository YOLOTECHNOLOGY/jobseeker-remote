import configuredAxios from 'helpers/configuredAxios'

const addUserPreferencesService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/job-preferences/update', { ...payload.preferences })
}
const deleteUserPreferencesService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.delete(`/job-preferences/${payload.preferenceId}/delete`)
}

const updateUserPreferencesService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.patch(`/job-preferences/${payload.preferenceId}/update`, payload.params)
}

const createUserPreferencesService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post(`/job-preferences/create`, payload.params)
}
export {
  addUserPreferencesService,
  deleteUserPreferencesService,
  updateUserPreferencesService,
  createUserPreferencesService
}
