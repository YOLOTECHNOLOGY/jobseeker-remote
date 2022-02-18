import configuredAxios from 'helpers/configuredAxios'

const updateUserCompleteProfileService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.put('/me', {...payload.profile})
}

export { updateUserCompleteProfileService }
