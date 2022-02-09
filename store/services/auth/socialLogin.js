import configuredAxios from 'helpers/configuredAxios'

const socialLoginService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/social_login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { socialLoginService }
