import configuredAxios from 'helpers/configuredAxios'

const updateUserCompleteProfileService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected')

  return axios.patch('/me', {...payload})
}

export { updateUserCompleteProfileService }
