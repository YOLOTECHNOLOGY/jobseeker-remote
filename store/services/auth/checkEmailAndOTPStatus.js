import configuredAxios from 'helpers/configuredAxios'

const checkEmailAndOTPStatusService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`/email/ready?user_id=${payload.userId}`)
}

export { checkEmailAndOTPStatusService }
