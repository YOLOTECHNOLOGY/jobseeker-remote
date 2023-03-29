import { memo } from 'react'
import { isMobile } from 'react-device-detect'
import { cookies } from 'next/headers'

import Head from './components/Head/Head'
import MainFC from './components/Main'
import AsideFC from './components/Aside'

import { addJobViewService as fetchAddJobViewService } from 'store/services/jobs/addJobView'

import styles from './page.module.scss'

const Index = ({ data, jobId }: any) => {
  const cookieStore = cookies()

  const accessToken = cookieStore.getAll('accessToken')

  const querys = {
    jobId,
    status: 'public',
    serverAccessToken: null
  }

  if (accessToken[0]) {
    querys.status = accessToken[0].value ? 'protected' : 'public'
    querys.serverAccessToken = accessToken[0].value ?? null
  }

  const tokenData = {
    source: 'job-detail',
    device: isMobile ? 'mobile_web' : 'web'
  }

  const params = Object.assign(querys, tokenData)

  console.log(params, '==================params')

  fetchAddJobViewService(params)

  const headProps = {
    title: data.job_title,
    localhost: data.location?.value,
    degree: data.degree?.value,
    xp_lvl: data.xp_lvl.value,
    jobType: data.job_type_value,
    salary: data.salary_range_value,
    jobId,
    is_saved: data.is_saved,
    chat: data.chat,
    job_type_value: data.job_type_value,
    status_key: data.status_key,
    jobDetail: data
  }

  const companyProps = {
    name: data.company?.name,
    companySize: data.company?.company_size,
    financingStage: data.company?.financing_stage,
    logo: data.company?.logo,
    numOfActiveJobs: data.company?.num_of_active_jobs,
    jobId,
    companyUrl: data.company?.company_url,
    published_at: data.published_at
  }

  const mainProps = {
    description: data.job_description_html,
    requirements: data.job_requirements_html,
    skills: data.skills,
    logo: data.company.logo,
    name: data.company.name,
    chatResponseRate: data.recruiter?.response_rate,
    lastActiveAt: data.recruiter?.last_active_at,
    benefitsProps: data.benefits,
    shareParams: {
      id: data.id,
      job_url: data.job_url,
      recruiter: {
        id: data.recruiter?.id
      },
      company: {
        id: data.company?.id
      }
    },
    lat: data.latitude,
    lng: data.longitude,
    full_address: data.full_address,
    published_at: data.published_at,
    recruiter: data.recruiter
  }

  return (
    <div>
      <Head {...headProps} />
      <div className={styles.container}>
        <MainFC {...mainProps} />
        <AsideFC {...companyProps} jobDetail={data} />
      </div>
    </div>
  )
}

export default memo(Index)
