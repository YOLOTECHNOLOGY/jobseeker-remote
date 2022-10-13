import configuredAxios from 'helpers/configuredAxios'

const changePhoneNumber = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/change-phone-number`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export { changePhoneNumber }
