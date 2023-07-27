import configuredAxios from 'helpers/configuredAxios'

const fetchBlacklistCompaniesService = (companyId) => {
    const axios = configuredAxios('company', 'protected')
    return axios.get(`/blacklist-companies/list?page=1&size=100`)
}

const fetchAddBlacklistCompaniesService = (payload) => {
    const axios = configuredAxios('company', 'protected')
    return axios.post(`/blacklist-companies/create`, payload)
}



export { fetchBlacklistCompaniesService, fetchAddBlacklistCompaniesService }