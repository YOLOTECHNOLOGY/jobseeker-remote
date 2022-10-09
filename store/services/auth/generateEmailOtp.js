import configuredAxios from 'helpers/configuredAxios'

const authenticationSendEmaillOtp = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/email-otp/generate`, {
      ...payload
    })
  )
}

export { authenticationSendEmaillOtp }
