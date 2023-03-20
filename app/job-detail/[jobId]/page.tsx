import Index from './index'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
const Page = async ({ params }: any) => {
  const data = await fetchJobDetailService(params)
    .then(({ data: { data } }) => data)
    .catch(() => ({ error: true }))
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
      <Index data={data} jobId={params?.jobId} />
    </>
  )
}

export default Page
