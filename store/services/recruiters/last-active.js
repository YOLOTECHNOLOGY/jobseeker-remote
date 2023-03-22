import configuredAxios from 'helpers/configuredAxios'

const fetchRecruiterLastActiveService = (ids) => {
  const axios = configuredAxios('recruiters')
  return axios.get(`/last-active?ids=${ids}`, { params: { ids } })
}

export { fetchRecruiterLastActiveService }
