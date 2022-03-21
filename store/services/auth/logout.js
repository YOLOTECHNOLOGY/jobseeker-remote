import configuredAxios from 'helpers/configuredAxios'

const logoutService = (payload) => {
  const axios = configuredAxios('auth', 'protected', '', payload.accessToken)
  return axios.post('/logout')
}

export { logoutService }
