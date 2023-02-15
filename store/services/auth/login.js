import configuredAxios from 'helpers/configuredAxios'

const loginService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  const msgToken = sessionStorage.getItem('firebase-messaging-token')
  return axios.post(`/login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    fcm_token_web_jobseeker:msgToken
  })
}

export { loginService }
