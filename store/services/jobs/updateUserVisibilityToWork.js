import configuredAxios from 'helpers/configuredAxios'

const updateUserVisibilityToWorkService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.patch('/me', payload)
}

export { updateUserVisibilityToWorkService }
