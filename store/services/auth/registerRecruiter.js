import configuredAxios from 'helpers/configuredAxios'

const registerRecruiterService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.post(`/recruiters/register`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { registerRecruiterService }
