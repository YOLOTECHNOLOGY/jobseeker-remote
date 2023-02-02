import configuredAxios from '../../configuredAxios'

export const update = applicationId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/${applicationId}/jobseekers`)
}

export const updateChat = chatId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/${chatId}/jobseekers`)
}