import configuredAxios from 'helpers/configuredAxios'
import { getLang } from 'helpers/country'

const socialLoginService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  const msgToken = sessionStorage.getItem('firebase-messaging-token')
  return axios.post(`/jobseekers/social-login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    fcm_token_web_jobseeker:msgToken,
    language_code: getLang()
  })
}

export { socialLoginService }
