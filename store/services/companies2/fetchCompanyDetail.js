import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyDetailService = (companyId) => {
  const axios = configuredAxios('company', 'protected')
  //TODO 上线后去掉is_internal
  return axios.get(`/${companyId}?is_internal=1`)
}

export { fetchCompanyDetailService }
