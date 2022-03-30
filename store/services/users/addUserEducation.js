import configuredAxios from 'helpers/configuredAxios'

const addUserEducationService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/educations/create', {...payload.educationData})
}

export { addUserEducationService }
