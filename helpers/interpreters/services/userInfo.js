import configuredAxios from '../../configuredAxios'
// eslint-disable-next-line no-undef

export const userInfo = ids => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.post('/users', {
    ids: ids,
    users_fields: 'id,full_name,avatar,last_active_at'
  })
}