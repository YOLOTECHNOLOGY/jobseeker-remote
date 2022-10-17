import axios from 'axios'
import { getCookie } from 'helpers/cookies'

const uploadUserAvatarService = (file) => {
  const accessToken = getCookie('accessToken')
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData()
  formData.append('avatar', file)
  formData.append('filename', file?.name)

  return axios.post(`${process.env.JOBSEEKER_URL}/upload-avatar`, formData, {
    headers: headers
  })
}

export { uploadUserAvatarService }
