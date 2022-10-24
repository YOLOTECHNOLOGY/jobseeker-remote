import configuredAxios from '../../configuredAxios'

export const accept = (applicationId, exchangeId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/contact-exchange-requests/${exchangeId}/approve`,
    )
}

export const decline = (applicationId, exchangeId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/contact-exchange-requests/${exchangeId}/decline`)
}

export const create = (applicationId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(`/${applicationId}/jobseekers/contact-exchange-requests/create`)
}

export const sendOTP = () => {
    const axios = configuredAxios('auth', 'protected')
    return axios.post('/sms-otp/verify-phone-number/generate')
}

export const verify = otp => {
    const axios = configuredAxios('auth', 'protected')
    return axios.post('/verify-phone-number',{otp})
}