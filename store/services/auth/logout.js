import configuredAxios from 'helpers/configuredAxios'

const logoutService = (payload) => {
  const axios = configuredAxios('auth', 'protected', '', payload.token)
  return axios.post('/log-out', payload)
}

export { logoutService }
