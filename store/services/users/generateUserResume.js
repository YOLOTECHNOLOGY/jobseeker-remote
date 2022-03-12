import configuredAxios from 'helpers/configuredAxios'

const generateUserResumeService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/generate-resume', {})
}

export { generateUserResumeService }
