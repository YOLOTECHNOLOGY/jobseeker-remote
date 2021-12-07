import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyDetailService = (companyId) => {
  const axios = configuredAxios('data', 'protected')
  return axios.get(`/companies/${companyId}`)
}

export { fetchCompanyDetailService }
