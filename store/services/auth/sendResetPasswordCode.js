import configuredAxios from 'helpers/configuredAxios'

const sendResetPasswordCodeService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.post(`otps/passwordRecovery`, {...payload})
}

export { sendResetPasswordCodeService }
