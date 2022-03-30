import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const fetchRecommendedCoursesService = (payload) => {
  const axios = configuredAxios('academy', 'public')
  return axios.get(`/recommended-courses?${queryString.stringify(payload)}`)
}

export { fetchRecommendedCoursesService }
