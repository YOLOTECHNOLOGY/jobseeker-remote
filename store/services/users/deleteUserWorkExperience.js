import configuredAxios from 'helpers/configuredAxios'

const deleteUserWorkExperienceService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.delete(`/work-experiences/${payload.workExperienceId}/delete`)
}

export { deleteUserWorkExperienceService }
