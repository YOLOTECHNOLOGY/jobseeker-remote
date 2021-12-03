import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyDetailService = () => {
  const axios = configuredAxios('data', 'protected')
  return axios.get(`/companies/${payload}`)
}

export { fetchCompanyDetailService }
