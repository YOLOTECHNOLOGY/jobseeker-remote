import configuredAxios from 'helpers/configuredAxios'

const checkResetPasswordCodeService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/reset-password/verify-otp`, {...payload})
}

export { checkResetPasswordCodeService }
