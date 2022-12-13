import configuredAxios from '../../configuredAxios'
// eslint-disable-next-line no-undef
export const requestFirstService = applicationId => {
  const axios = configuredAxios('jobApplication', 'protected')
  return axios.get(`job-applications/${applicationId}/chats/first/recruiters`)
}

