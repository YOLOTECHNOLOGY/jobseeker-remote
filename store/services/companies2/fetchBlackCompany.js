import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'


const fetchSearchCompanyService = (payload) => {
    const axios = configuredAxios('company', 'protected')
    return axios.get(`/search?${queryString.stringify(payload)}`)
  }

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

const fetchDeleteBlacklistCompaniesService = ({id}) => {
    const axios = configuredAxios('company', 'protected')
    if(!id) return
    return axios.delete(`/${id}/blacklist-companies/delete`)
}

export { fetchSearchCompanyService, fetchBlacklistCompaniesService, fetchAddBlacklistCompaniesService, fetchDeleteBlacklistCompaniesService }