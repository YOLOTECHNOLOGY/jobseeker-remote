import configuredAxios from '../../configuredAxios'
// eslint-disable-next-line no-undef
export const requestFirstService = chatId => {
  const axios = configuredAxios('jobApplication', 'protected')
  return axios.put(`/chats/${chatId}/jobseekers/process`)
}

