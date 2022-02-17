import configuredAxios from 'helpers/configuredAxios'

const resetPasswordService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/reset-password`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { resetPasswordService }
