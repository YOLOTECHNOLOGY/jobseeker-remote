import configuredAxios from 'helpers/configuredAxios'

const fetchUserEducationService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.get('/educations')
}

export { fetchUserEducationService }
