import configuredAxios from 'helpers/configuredAxios'

const updateUserEducationService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.patch(`/educations/${payload.educationId}/update`, {...payload.educationData})
}

export { updateUserEducationService }
