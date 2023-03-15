import configuredAxios from '../../configuredAxios'

export const sendResume = (applicationId, requestResumeId, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/resume-requests/${requestResumeId}/complete`,
        params
    )
}
export const sendResumeDetail = (applicationId, requestResumeId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(
        `/${applicationId}/jobseekers/resume-requests/${requestResumeId}`
    )
}

export const askSendResume = (applicationId, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(
        `/${applicationId}/jobseekers/resume-requests/create`,
        params
    )
}

export const decline = (applicationId, requestResumeId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/resume-requests/${requestResumeId}/decline`)
}

export const getList = () => {
    const axios = configuredAxios('jobseeker', 'protected')
    return axios.get(`/resumes`)
}
export const deleteOne = id => {
    const axios = configuredAxios('jobseeker', 'protected')
    return axios.delete(`/resumes/${id}/delete`)
}