import configuredAxios from 'helpers/configuredAxios'

export const fetchRecruiterLastActiveService = (ids) => {
  const axios = configuredAxios('recruiters')
  return axios.get(`/last-active?ids=${ids}`, { params: { ids } })
}

