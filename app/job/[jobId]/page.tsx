import Index from './index'
import { cookies } from 'next/headers'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
const Page = async ({ params }: any) => {
  const cookieStore = cookies()
  const accessToken = cookieStore.getAll('accessToken')
  const jobId = params.jobId?.split('-').pop()
  console.log(params, jobId)
  const querys = {
    jobId,
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

  // .then(({ data: { data } }) => data)
  // .catch(() => ({ error: true }))
  // await fetchJobDetailService(params)
  //   .then(({ data: { data } }) => data)
  //   .catch(() => ({ error: true }))
  // await fetchJobDetailService(params)
  //   .then(({ data: { data } }) => data)
  //   .catch(() => ({ error: true }))
  // await fetchJobDetailService(params)
  //   .then(({ data: { data } }) => data)
  //   .catch(() => ({ error: true }))
  // await fetchJobDetailService(params)
  //   .then(({ data: { data } }) => data)
  //   .catch(() => ({ error: true }))
  console.log(data, 'success')

  return (
    <>
      <Index data={data} jobId={jobId} />
    </>
  )
}

export default Page
