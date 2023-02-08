import configuredAxios from 'helpers/configuredAxios'

const socialLoginService = (payload) => {
  const axios = configuredAxios('jobseeker', 'public')
  return axios.post(`/social-login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { socialLoginService }
