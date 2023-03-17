import Head from './components/Head/Head'
import MainFC from './components/Main/'
import AsideFC from './components/Aside/'

import styles from './page.module.scss'

const Index = ({ data, jobId }: any) => {
  const headProps = {
    title: data.job_title,
    localhost: data.location?.value,
    degree: data.degree?.value,
    xp_lvl: data.xp_lvl.value,
    jobType: data.job_type_value,
    salary: data.salary_range_value
  }

  const companyProps = {
    name: data.company?.name,
    companySize: data.company?.company_size,
    financingStage: data.company?.financing_stage,
    logo: data.company?.logo,
    numOfActiveJobs: data.company?.num_of_active_jobs,
    jobId
  }

  const mainProps = {
    description: data.job_description_html,
    requirements: data.job_requirements_html,
    skills: data.skills,
    logo: data.company.logo,
    name: data.company.name,
    chatResponseRate: data.recruiter?.response_rate,
    lastActiveAt: data.recruiter?.last_active_at,
    benefitsProps: data.benefits
  }

  return (
    <div>
      <Head {...headProps} />
      <div className={styles.container}>
        <MainFC {...mainProps} />
        <AsideFC {...companyProps} />
      </div>
    </div>
  )
}

export default Index
