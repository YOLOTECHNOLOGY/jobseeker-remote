import configuredAxios from 'helpers/configuredAxios'
import axios from 'axios'

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
const uploadVideoResume = (url, id) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/upload-video-resume'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData()
  formData.append('url', url)
  formData.append('video_resume_id', id)
  // formData.append('parse_resume', true)

  return axios.post(URL, formData, { headers })
}

const generatePresignedUrl = (fileName) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/video-resumes/generate-presigned-url'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData()
  formData.append('file_name', fileName)
  return axios.post(URL, formData, { headers })
}

const uploadVideoToAmazonService = (url, file) => {
  return axios.put(url, file, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Accept": "*/*",
      "Cache-Control": "no-cache",
      "Content-Type": file.type,
    }
  })
}

const getVideoResumeList = () => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/video-resumes'
  return axios.get(URL)
}
const deleteVideoResume = (id) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = `/video-resume/${id}/delete`
  return axios.delete(URL)
}

const resumeTemplateList = () => {
  const axios = configuredAxios('resumeTemplate', 'protected')
  const URL = '/public/list'
  return axios.get(URL)
}

export {
  uploadUserResumeService,
  uploadVideoCover,
  uploadVideoResume,
  uploadVideoToAmazonService,
  generatePresignedUrl,
  getVideoResumeList,
  deleteVideoResume,
  resumeTemplateList
}
