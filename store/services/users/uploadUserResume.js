import axios from 'axios'
import { getCookie } from 'helpers/cookies'

const uploadUserResumeService = (payload) => {
  const accessToken = getCookie('accessToken')
  const { resume } = payload
  
  const URL = `${process.env.JOBSEEKER_URL}/upload-resume`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data'
  }

  let formData = new FormData()
  formData.append('file', resume)
  formData.append('filename', resume.name)

  return axios.post(URL, formData, { headers })
}

export { uploadUserResumeService }
