import configuredAxios from 'helpers/configuredAxios'

const loginService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { loginService }
