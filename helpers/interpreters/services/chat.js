import configuredAxios from '../../configuredAxios'

export const getAuth = userId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/jobseekers/im-auth-code?auid=${userId}&ver=1`)
}
export const list = params => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/jobseekers/chat-ids`, { params })
}
export const createChat = (jobId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(`/jobs/${jobId}/jobseekers/chat`, params)
}
export const check = (recruiter_ids, accessToken) => {
    const axios = configuredAxios('jobApplication', 'protected', null, accessToken)
    return axios.get(`/chats/check-exists/jobseekers`, { params: { recruiter_ids } })
}
export const infoAlert = (chatId, hasPhone, hasEmail) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post('chats/jobseekers/contact-exchange-requests/alert', {
        'send-text-phone': hasPhone ? 'true' : 'false',
        'send-text-email': hasEmail ? 'true' : 'false',
        chat_id: chatId
    })
}