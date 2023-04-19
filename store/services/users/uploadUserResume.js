import configuredAxios from 'helpers/configuredAxios'

const uploadUserResumeService = (resume) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/upload-resume'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData()
  formData.append('file', resume)
  formData.append('filename', resume.name)
  formData.append('parse_resume', true)

  return axios.post(URL, formData, { headers })
}

export { uploadUserResumeService }
