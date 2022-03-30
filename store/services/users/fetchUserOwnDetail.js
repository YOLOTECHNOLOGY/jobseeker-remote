import configuredAxios from 'helpers/configuredAxios'

const fetchUserOwnDetailService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.get('/me')
}

export { fetchUserOwnDetailService }
