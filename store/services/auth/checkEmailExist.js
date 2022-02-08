import configuredAxios from 'helpers/configuredAxios'

const checkEmailExistService = (email) => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`users/is-email-exists?email=${email}`)
}

export { checkEmailExistService }
