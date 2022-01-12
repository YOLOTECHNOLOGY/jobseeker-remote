import configuredAxios from 'helpers/configuredAxios'

const registerUserService = (payload) => {
  const axios = configuredAxios('data', 'public')

  return axios.post('/users/register', {...payload})
}

export { registerUserService }
