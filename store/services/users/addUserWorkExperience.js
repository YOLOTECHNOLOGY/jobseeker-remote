import configuredAxios from 'helpers/configuredAxios'

const addUserWorkExperienceService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/work-experiences/create', {...payload.workExperiences})
}

export { addUserWorkExperienceService }
