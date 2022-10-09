import configuredAxios from 'helpers/configuredAxios'

const authenticationSendEmailMagicLink = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/jobseekers/email-magic-link/generate`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export { authenticationSendEmailMagicLink }
