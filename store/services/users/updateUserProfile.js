import configuredAxios from 'helpers/configuredAxios'
import { getCookie } from 'helpers/cookies'

const updateUserProfileService = (payload) => {
  const accessToken = getCookie('accessToken')
  const axios = configuredAxios('jobseeker', 'protected', '', accessToken)

  return axios.patch('/me', payload)
}

export { updateUserProfileService }
