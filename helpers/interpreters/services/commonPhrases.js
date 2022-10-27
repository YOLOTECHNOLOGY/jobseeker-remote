import configuredAxios from '../../configuredAxios'

// eslint-disable-next-line no-undef
export const list = () => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.get('/common-phrases')
}

export const update = (id, params) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.patch(`/common-phrases/${id}/update`, params)
}

export const deleteOne = (id, params) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.delete(`/common-phrases/${id}/delete`, params)
}

export const create = (params) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.post('/common-phrases/create', params)
}

