import configuredAxios from 'helpers/configuredAxios'

const checkSocialUserExistService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/has_social_login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { checkSocialUserExistService }
