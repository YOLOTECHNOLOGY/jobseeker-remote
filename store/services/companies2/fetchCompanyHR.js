import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyHRService = (companyId, token) => {
  const axios = configuredAxios('company', 'protected', null, token);
  return axios.get(`manage-company/${companyId}/company-members-list`);
}

export { fetchCompanyHRService }
