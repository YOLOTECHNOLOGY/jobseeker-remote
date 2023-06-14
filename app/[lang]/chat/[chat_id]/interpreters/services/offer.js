import configuredAxios from 'helpers/configuredAxios'

export const accept = (applicationId, offerId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/offers/${offerId}/accepted`
    )
}

export const decline = (applicationId, offerId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/offers/${offerId}/declined`

    )
}
export const detail = (applicationId, offerId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(
        `/${applicationId}/jobseekers/offers/${offerId}`
    )
}
