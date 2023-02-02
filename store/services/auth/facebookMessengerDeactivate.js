import configuredAxios from 'helpers/configuredAxios'

const facebookMessengerDeactivate = () => {
  const axios = configuredAxios('jobseeker', 'protected')
  return Promise.resolve(
    axios.post(`/facebook/messenger/deactivate`, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export { facebookMessengerDeactivate }
