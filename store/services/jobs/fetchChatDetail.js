import configuredAxios from 'helpers/configuredAxios'

export const fetchChatDetailService =(payload) => {
  const axios = configuredAxios('jobApplication', payload.status, false, payload.serverAccessToken)
  return axios.get(`/chats/check-exists/${payload.recruiterId}/jobseekers`)
}
