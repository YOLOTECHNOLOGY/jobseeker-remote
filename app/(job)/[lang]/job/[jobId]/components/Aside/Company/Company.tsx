import Link from 'next/link'
import { Avatar, Button } from 'app/components/MUIs'
import styles from '../../../page.module.scss'
import { formatTemplateString } from 'helpers/formatter'
import { getValueById } from 'helpers/config/getValueById'
import React from 'react'
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
}

const Company = (company: propsType) => {
  const { jobDetail, languages, config, lang } = company
  const {
    aside: { company: companySection }
  } = languages as any
  const industry = getValueById(config, jobDetail.company.industry_id, 'industry_id')
  return (
    <>
      <section className={styles.company}>
        <Link href={'/' + lang + company.companyUrl}>
          {/* <div className={styles.company_title}>{companySection.title}</div> */}
          <div className={styles.company_info}>
            <Avatar
              src={company.logo}
              sx={{ borderRadius: '5px', width: '60px', height: '60px', margin: '8px 0' }}
            />
            <div>
              <h5 className={styles.company_name}>{company.name}</h5>
              <div className={styles.company_financingStage}>
                {company.companySize} <span>|</span> {companySection.employees} {industry}
              </div>
            </div>
          </div>

          {/* <div className={styles.company_financingStage}>
          
          </div> */}
        </Link>

        <Link href={'/' + lang + company?.companyUrl + '/jobs'}>
          <Button
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
        </Link>
      </section>

      <Link href={'/' + lang + company?.companyUrl}>
        <section className={styles.company_mobileHead}>
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
      </Link>
    </>
  )
}

export default Company
