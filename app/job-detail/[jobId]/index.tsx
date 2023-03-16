'use client'
import Head from './components/Head/Head'
import Main from './components/Main/Main'
import Aside from './components/Aside'

import styles from './page.module.scss'

const Index = ({ data }: any) => {
  // const descProps = {
  //   description: data.job_description_html
  //   requirements: data.job_requirements_html
  //   skills: data.skills
  //   logo: data.company?.logo
  //   name: data.company?.name
  //   chatResponseRate: data.
  //   lastActiveAt
  // }

  const headProps = {
    title: data.job_title,
    localhost: data.location?.value,
    degree: data.degree?.value,
    xp_lvl: data.xp_lvl.value,
    jobType: data.job_type_value,
    salary: data.salary_range_value
  }

  return (
    <div>
      <Head {...headProps} />
      <div className={styles.container}>
        <Main />
        <Aside />
      </div>
    </div>
  )
}

export default Index
