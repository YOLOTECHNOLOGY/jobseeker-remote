import configuredAxios from 'helpers/configuredAxios'

const registerJobseekerService = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/register`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { registerJobseekerService }
