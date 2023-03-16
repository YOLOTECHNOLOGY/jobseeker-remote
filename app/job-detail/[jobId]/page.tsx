// 'use client'

import Head from './components/Head/Head'
// import Main from './components/Main/Main'

// import styles from './page.module.scss'

import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
// async function getCompanyData(params) {
//   const res = await fetchJobDetailService(params)
//   // .then((response) => response)
//   // .catch((error) => error)
//   return res
// }

const Page = async ({ params }: any) => {
  const data = await fetchJobDetailService(params)
    .then(({ data: { data } }) => data)
    .catch(() => ({ error: true }))
  console.log(data, 'success')

  const headProps = {
    title: data.job_title,
    localhost: data.location?.value,
    degree: data.degree?.value,
    xp_lvl: data.xp_lvl.value,
    jobType: data.job_type_value,
    salary: data.salary_range_value
  }

  // const descProps = {
  //   description: data.job_description_html
  //   requirements: data.job_requirements_html
  //   skills: data.skills
  //   logo: data.company?.logo
  //   name: data.company?.name
  //   chatResponseRate: data.
  //   lastActiveAt
  // }

  return (
    <div>
      <Head {...headProps} />
      {/* <Main /> */}
    </div>
  )
}

export default Page
