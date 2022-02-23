import configuredAxios from 'helpers/configuredAxios'

const updateUserWorkExperienceService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.put(`/work-experiences/${payload.workExperienceId}/update`, {...payload.workExperienceData})
}

export { updateUserWorkExperienceService }
