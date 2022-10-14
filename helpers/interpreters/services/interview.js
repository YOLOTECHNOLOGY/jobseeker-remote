import configuredAxios from '../../configuredAxios'

export const accept = (applicationId, inviteInterviewId) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/accept`)
}
export const cancel = (applicationId, inviteInterviewId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/cancel`, params)
}
export const decline = (applicationId, inviteInterviewId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/decline`, params)
}
export const checkIn = (applicationId, inviteInterviewId) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/check-in`)
}
export const reportIssue = (applicationId, inviteInterviewId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/report-issue`, params)
}
export const askResult = (applicationId, inviteInterviewId) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/ask-result`)
}