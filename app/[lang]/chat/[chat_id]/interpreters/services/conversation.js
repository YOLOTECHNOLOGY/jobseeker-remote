import configuredAxios from "helpers/configuredAxios"
export const deleteChat = chatId => {
  const axios = configuredAxios('jobApplication', 'protected')
  return axios.delete(`/chats/jobseekers/delete-chat/${chatId}`)
}
