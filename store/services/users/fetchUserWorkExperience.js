import configuredAxios from 'helpers/configuredAxios'

const fetchUserWorkExperienceService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.get('/work-experiences')
}

export { fetchUserWorkExperienceService }
