import configuredAxios from 'helpers/configuredAxios'

const checkEmailExistService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`users/is-email-exists?email=${payload.email}`)
}

export { checkEmailExistService }
