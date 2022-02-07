import configuredAxios from 'helpers/configuredAxios'

const registerJobseekerService = (payload) => {
  const axios = configuredAxios('data', 'public')
  return axios.post(`/users/register`, {
    ...payload,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
}

export { registerJobseekerService }
