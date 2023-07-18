import React, { memo } from 'react'
import { isMobile } from 'react-device-detect'
import { cookies, headers } from 'next/headers'
import { serveIsMobile } from 'helpers/utilities'

import Head from './components/Head/Head'
import MainFC from './components/Main'
import AsideFC from './components/Aside'

import { addJobViewService as fetchAddJobViewService } from 'store/services/jobs/addJobView'

import styles from './page.module.scss'
import { getValueById } from 'helpers/config/getValueById'
import Menu from './components/Main/menu'
const Index = ({ data, jobId, languages, config, lang }: any) => {
  const cookieStore = cookies()
  const headeStore = headers()

  const accessToken = cookieStore.getAll('accessToken')
  const source = cookieStore.get('source')?.value
  const recoFrom = cookieStore.get('reco_from')?.value

  const querys = {
    jobId,
    status: 'public',
    serverAccessToken: null
  }

  if (accessToken[0]) {
    querys.status = accessToken[0].value ? 'protected' : 'public'
    querys.serverAccessToken = accessToken[0].value ?? null
  }

  const userAgent = headeStore.get('user-agent')

  const tokenData = {
    source: source ? source : 'job_search',
    device: serveIsMobile(userAgent) ? 'mobile_web' : 'web',
    reco_from: recoFrom ? recoFrom : null
  }

  const params = Object.assign(querys, tokenData)

  fetchAddJobViewService(params)

  if (process.env.ENV === 'production' && typeof window !== 'undefined') {
    const w = window as any

    // Google tag job page view event
    const gtag = w?.gtag
    if (gtag) {
      gtag('event', 'job_page_view', {
        job_id: jobId
      })
    }
    // Facebook job page view event
    const fbq = w?.gtag
    if (fbq) {
      fbq.event('job_page_view', {
        job_id: jobId
      })
    }
  }

  const headProps = {
    title: data.job_title,
    localhost: getValueById(config, data.location?.id, 'location_id'),
    degree: getValueById(config, data.degree?.id, 'degree_id'),
    xp_lvl: getValueById(config, data.xp_lvl?.id, 'xp_lvl_id'),
    jobType: getValueById(config, data?.job_type_id, 'job_type_id'),
    salary: data.local_salary_range_value,
    jobId,
    is_saved: data.is_saved,
    chat: data.chat,
    job_type_value: data.job_type_value,
    status_key: data.status_key,
    jobDetail: data,
    languages,
    shareParams: {
      id: data.id,
      job_url: data.job_url,
      recruiter: {
        id: data.recruiter?.id
      },
      company: {
        id: data.company?.id
      }
    }
  }

  const companyProps = {
    name: data.company?.name,
    companySize: data.company?.company_size,
    financingStage: data.company?.financing_stage,
    logo: data.company?.logo,
    numOfActiveJobs: data.company?.num_of_active_jobs,
    jobId,
    companyUrl: data.company?.company_url,
    published_at: data.published_at,
    languages
  }

  const mainProps = {
    description: data.job_description_html,
    requirements: data.job_requirements_html,
    skills: data.skills,
    logo: data.company?.logo,
    name: data.company?.name,
    chatResponseRate: data.recruiter?.response_rate,
    lastActiveAt: data.recruiter?.last_active_at,
    benefitsProps: data?.benefits?.map((e) => getValueById(config, e.id, 'job_benefit_id', 'name')),
    shareParams: {
      id: data.id,
      job_url: data.job_url,
      recruiter: {
        id: data.recruiter?.id
      },
      company: {
        id: data.company?.id
      },
      is_saved: data.is_saved
    },
    lat: data.latitude,
    lng: data.longitude,
    full_address: data.full_address,
    published_at: data.published_at,
    recruiter: data.recruiter,
    languages
  }

  return (
    <div>
      <div className={styles.headSticky}>
        <Head {...headProps} />
        <Menu
          {...mainProps}
          lang={languages}
          jobDetail={data}
          isbenefits={!!mainProps?.benefitsProps?.length}
        />
      </div>

      <div style={{ background: '#f5f7fb' }}>
        <div className={styles.container}>
          <MainFC {...mainProps} />
          <AsideFC {...companyProps} jobDetail={data} lang={lang} config={config} />
        </div>
      </div>
    </div>
  )
}

export default memo(Index)
