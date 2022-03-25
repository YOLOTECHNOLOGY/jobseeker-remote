import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyDetailService = (companyId) => {
  const axios = configuredAxios('company', 'protected')
  return axios.get(`/${companyId}`)
}

export { fetchCompanyDetailService }
