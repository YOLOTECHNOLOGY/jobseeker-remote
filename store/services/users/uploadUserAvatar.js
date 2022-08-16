import axios from 'axios'
import { getCookie } from 'helpers/cookies'

const uploadUserAvatarService = (file) => {
  const accessToken = getCookie('accessToken')
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  }

  const formData = new FormData()
  formData.append('avatar', file)
  formData.append('filename', file)

  return axios.post(`${process.env.DATA_BOSSJOB_URL}/users/avatars`, formData, {
    headers: headers,
  })
}

export { uploadUserAvatarService }