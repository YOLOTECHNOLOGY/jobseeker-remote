import configuredAxios from 'helpers/configuredAxios'

const resetPasswordService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.patch(`/users/reset_password`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { resetPasswordService }
