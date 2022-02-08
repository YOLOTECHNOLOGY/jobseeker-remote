import configuredAxios from 'helpers/configuredAxios'

const sendResetPasswordCodeService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/reset-password-otp`, {...payload})
}

export { sendResetPasswordCodeService }
