import configuredAxios from 'helpers/configuredAxios'

const completeUserProfileService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/complete-profile', {})
}

export { completeUserProfileService }
