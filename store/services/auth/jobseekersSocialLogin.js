import configuredAxios from 'helpers/configuredAxios'
import { getLang } from 'helpers/country'

const authenticationJobseekersLogin = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  const msgToken = sessionStorage.getItem('firebase-messaging-token')

  return axios.post(`/jobseekers/social-login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    fcm_token_web_jobseeker:msgToken,
    language_code: getLang()
  })
}

export { authenticationJobseekersLogin }
