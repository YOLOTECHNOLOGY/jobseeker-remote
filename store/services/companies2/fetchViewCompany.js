import configuredAxios from 'helpers/configuredAxios'

const fetchViewCompany = ({ id, payload }) => {
  const axios = configuredAxios('company', 'public')
  return axios.post(`/${id}/view`, payload)
}

export { fetchViewCompany }
