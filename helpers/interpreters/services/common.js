import configuredAxios from '../../configuredAxios'

export const update = applicationId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/chats/${applicationId}/jobseekers`)
}