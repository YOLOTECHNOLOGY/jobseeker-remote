import configuredAxios from 'helpers/configuredAxios'

const jobseekerTokenValidate = (token) => {
  const axios = configuredAxios('auth', 'protected')
  return axios.get(`/jobseekers/token/validate`, { params: { token } })
}

export { jobseekerTokenValidate }
