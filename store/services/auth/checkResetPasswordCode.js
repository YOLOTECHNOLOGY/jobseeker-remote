import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const checkResetPasswordCodeService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`otps?${queryString.stringify(payload)}`)
}

export { checkResetPasswordCodeService }
