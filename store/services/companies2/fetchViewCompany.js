import configuredAxios from 'helpers/configuredAxios'

const fetchViewCompany = ({ id, payload, token }) => {
  const state = token ? 'protected' : 'public'
  const axios = configuredAxios('company', state);
  return axios.post(`/${id}/view`, payload)
}

export { fetchViewCompany }
