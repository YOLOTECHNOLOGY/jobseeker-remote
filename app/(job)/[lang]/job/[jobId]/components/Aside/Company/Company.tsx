'use client'
import Link from 'next/link'
import { Avatar, Button } from 'app/components/MUIs'
import styles from '../../../page.module.scss'
import { formatTemplateString } from 'helpers/formatter'
import { getValueById } from 'helpers/config/getValueById'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { setCookie } from 'helpers/cookies'
export type propsType = {
  name: string
  companySize: string
  financingStage: string
  logo: string
  numOfActiveJobs: number
  jobId: number
  companyUrl: string
  jobDetail: any
  languages: Record<string, any>
  config: Array<any>
  lang: string
  company_id: number
  reco_from: string
}

const Company = (company: propsType) => {
  const { jobDetail, languages, config, lang } = company
  const {
    aside: { company: companySection }
  } = languages as any
  const industry = getValueById(config, jobDetail.company.industry_id, 'industry_id')

  const sendViewCompany = (url) => {
    const params = {
      id: company?.company_id,
      payload: {
        source: 'job_search',
        device: isMobile ? 'mobile_web' : 'web',
        device_udid: localStorage.getItem('deviceUdid')
      }
    }
    setCookie('view-company-buried', JSON.stringify(params))
    window.location.href = url
  }

  return (
    <>
      <section className={styles.company}>
        {/* <div className={styles.company_title}>{companySection.title}</div> */}
        <div
          className={styles.company_info}
          onClick={() => sendViewCompany('/' + lang + company.companyUrl)}
        >
          <Avatar
            src={company.logo}
            sx={{ borderRadius: '5px', width: '60px', height: '60px', margin: '8px 0' }}
          />
          <div>
            <h5 className={styles.company_name}>{company.name}</h5>
            <div className={styles.company_financingStage}>
              {company.companySize} <span>|</span> {industry}
            </div>
          </div>
        </div>

        <Button
          onClick={() => sendViewCompany('/' + lang + company?.companyUrl + '/jobs')}
          variant='outlined'
          sx={{
            height: '44px',
            width: '100%',
            marginTop: '5px',
            borderRadius: '10px',
            border: '1px solid #136FD3',
            fontStyle: 'normal',
            fontSize: '14px',
            lineHeight: '18px',
            letterSpacing: '0.0075em',
            color: '#136FD3',
            textTransform: 'inherit'
          }}
        >
          {formatTemplateString(companySection.allJobHiring, company.numOfActiveJobs)}
        </Button>
      </section>

      <section
        className={styles.company_mobileHead}
        onClick={() => sendViewCompany('/' + lang + company?.companyUrl)}
      >
        <Avatar
          sx={{ width: '60px', height: '60px', borderRadius: '5px', marginRight: '8px' }}
          src={company?.logo}
        ></Avatar>
        <div className={styles.company_mobileHead_info}>
          <span className={styles.company_mobileHead_info_name}>{company?.name}</span>
          <span className={styles.company_mobileHead_info_tag}>
            {jobDetail.company.industry} &nbsp;|&nbsp; {company.companySize}{' '}
            {companySection.employees}
          </span>
        </div>
      </section>
    </>
  )
}

export default Company
