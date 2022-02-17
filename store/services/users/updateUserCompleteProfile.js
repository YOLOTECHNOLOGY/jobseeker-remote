import configuredAxios from 'helpers/configuredAxios'

const updateUserCompleteProfileService = (payload) => {
  const axios = configuredAxios('job', 'protected')

  return axios.put('/me', {...payload})
}

export { updateUserCompleteProfileService }
