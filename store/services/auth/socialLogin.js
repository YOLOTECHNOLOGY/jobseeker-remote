import configuredAxios from 'helpers/configuredAxios'

const socialLoginService = (payload) => {
  const axios = configuredAxios('auto', 'public')
  return axios.post(`/jobseekers/social-login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { socialLoginService }
