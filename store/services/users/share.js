import configuredAxios from 'helpers/configuredAxios'

const fetchUserShare = (data) => {
  const axios = configuredAxios('jobseeker', 'protected')

  return axios.post('/share-job', data)
}

export { fetchUserShare }
