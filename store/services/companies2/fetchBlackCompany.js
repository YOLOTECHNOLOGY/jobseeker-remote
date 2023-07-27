import configuredAxios from 'helpers/configuredAxios'

const fetchBlacklistCompaniesService = (payload) => {
    const axios = configuredAxios('company', 'protected')
    const page = payload.page || 1
    const size = payload.size || 10
    return axios.get(`/blacklist-companies/list?page=${page}&size=${size}`)
}

const fetchAddBlacklistCompaniesService = (payload) => {
    const axios = configuredAxios('company', 'protected')
    return axios.post(`/blacklist-companies/create`, payload)
}

const fetchDeleteBlacklistCompaniesService = (payload) => {
    const axios = configuredAxios('company', 'protected')
    return axios.post(`/blacklist-companies/delete`, payload)
}



export { fetchBlacklistCompaniesService, fetchAddBlacklistCompaniesService, fetchDeleteBlacklistCompaniesService }