import configuredAxios from '../../configuredAxios'

export const accept = (applicationId, exchangeId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/contact-exchange-requests/${exchangeId}/approve`,
    )
}

export const decline = (applicationId, exchangeId,params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/contact-exchange-requests/${exchangeId}/decline`,params)
}

export const create = (applicationId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(`/${applicationId}/jobseekers/contact-exchange-requests/create`)
}

export const sendOTP = (params) => {
    const axios = configuredAxios('auth', 'protected')
    return axios.post('/sms-otp/change-phone-number/generate',params)
}

export const verify = params => {
    const axios = configuredAxios('auth', 'protected')
    return axios.post('/change-phone-number',params)
}