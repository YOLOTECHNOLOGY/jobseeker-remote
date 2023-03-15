// 'use client'

import Head from './components/Head/Head'

import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
// async function getCompanyData(params) {
//   const res = await fetchJobDetailService(params)
//   // .then((response) => response)
//   // .catch((error) => error)
//   return res
// }

const Page = async ({ params }: any) => {
  console.log(params, '============================')
  const data = await fetchJobDetailService(params)
  console.log(data, 'success')

  return (
    <div>
      <Head />
    </div>
  )
}

export default Page
