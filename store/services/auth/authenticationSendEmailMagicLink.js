import configuredAxios from 'helpers/configuredAxios'

const authenticationSendEmailMagicLink = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/jobseekers/email-magic-link/generate`, {
      ...payload
    })
  )
}

export { authenticationSendEmailMagicLink }
