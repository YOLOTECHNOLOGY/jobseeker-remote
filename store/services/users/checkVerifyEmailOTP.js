import configuredAxios from 'helpers/configuredAxios'

const checkVerifyEmailOTPService = (payload) => {
  const axios = configuredAxios('data', 'protected')

  return axios.get(`/email/verify?code=${payload}`)
}

export { checkVerifyEmailOTPService }
