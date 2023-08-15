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
const uploadVideoCover = (fileName) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/video-resumes/upload-video-cover'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  const formData = new FormData()
  formData.append('video_cover', fileName)
  return axios.post(URL, formData, {
    headers
  })
}
const uploadVideoResume = () => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/upload-video-resume'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  // const formData = new FormData()
  // formData.append('file', resume)
  // formData.append('filename', resume.name)
  // formData.append('parse_resume', true)

  return axios.post(URL, formData, { headers })
}

const generatePresignedUrl = () => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/video-resumes/generate-presigned-url'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  // const formData = new FormData()
  // formData.append('file', resume)
  // formData.append('filename', resume.name)
  // formData.append('parse_resume', true)

  return axios.post(URL, formData, { headers })
}

export {
  uploadUserResumeService,
  uploadVideoCover,
  uploadVideoResume,
  generatePresignedUrl
}
