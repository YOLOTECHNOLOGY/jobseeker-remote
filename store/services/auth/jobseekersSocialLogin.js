import configuredAxios from 'helpers/configuredAxios'

const authenticationJobseekersLogin = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return axios.post(`/jobseekers/social-login`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { authenticationJobseekersLogin }
