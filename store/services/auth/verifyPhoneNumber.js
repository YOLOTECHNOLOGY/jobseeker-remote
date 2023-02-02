import configuredAxios from 'helpers/configuredAxios'

const verifyPhoneNumber = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/verify-phone-number`, {
      ...payload
    })
  )
}

export { verifyPhoneNumber }
