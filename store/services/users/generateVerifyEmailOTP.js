import configuredAxios from 'helpers/configuredAxios'

const generateVerifyEmailOTPService = (payload) => {
  const axios = configuredAxios('data', 'protected')

  return axios.post('/email/generate-otp')
}

export { generateVerifyEmailOTPService }
