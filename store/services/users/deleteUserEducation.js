import configuredAxios from 'helpers/configuredAxios'

const deleteUserEducationService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.delete(`/educations/${payload.educationId}/delete`)
}

export { deleteUserEducationService }
