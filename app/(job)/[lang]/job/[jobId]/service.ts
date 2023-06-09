import { cookies } from "next/headers"
import { fetchJobDetailService } from "store/services/jobs/fetchJobDetail"
import { cache } from 'react'
export const handleFetchJobDetail = cache(async (params: any) => {
    const cookieStore = cookies()
  
    const accessToken = cookieStore.getAll('accessToken')
    const jobId = params.jobId?.split('-').pop()
  
    if (jobId && Number(jobId)) {
      const querys = {
        jobId: jobId,
        status: 'public',
        serverAccessToken: null
      }
  
      if (accessToken[0]) {
        querys.status = accessToken[0].value ? 'protected' : 'public'
        querys.serverAccessToken = accessToken[0].value ?? null
      }
  
      const data = await fetchJobDetailService(querys)
        .then(({ data: { data } }) => data)
        .catch(() => ({ error: true }))
      return { data, jobId }
    } else {
      return { data: { error: true, message: 'Error: Invalid link address' }, jobId: null }
    }
  })