import Link from 'next/link'
import { Avatar, Button } from 'app/[lang]/components/MUIs'

import styles from '../../../page.module.scss'
import { formatTemplateString } from 'helpers/formatter'

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
}

const Company = (company: propsType) => {
  const { jobDetail, languages } = company
  const {
    aside: { company: companySection, similarJob, signUp }
  } = languages as any
  return (
    <>
      <section className={styles.company}>
        <Link href={company.companyUrl}>
          <div className={styles.company_title}>{companySection.title}</div>
          <Avatar src={company.logo} sx={{ borderRadius: '5px', margin: '8px 0' }} />
          <h5 className={styles.company_name}>{company.name}</h5>
          <div className={styles.company_financingStage}>{jobDetail.company.industry}</div>
          <div className={styles.company_financingStage}>
            {company.companySize} {companySection.employees}
          </div>
        </Link>

        <Link href={company.companyUrl + '/jobs'}>
          <Button
            variant='outlined'
            sx={{
              height: '44px',
              width: '100%',
              marginTop: '5px',
              borderRadius: '10px',
              border: '1px solid #136FD3',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '18px',
              letterSpacing: '0.0075em',
              color: '#136FD3',
              textTransform: 'capitalize'
            }}
          >
            {formatTemplateString(companySection.allJobHiring, company.numOfActiveJobs)}
          </Button>
        </Link>
      </section>

      <Link href={company.companyUrl}>
        <section className={styles.company_mobileHead}>
          <Avatar
            sx={{ width: '32px', height: '32px', borderRadius: '5px', marginRight: '8px' }}
            src={company.logo}
          ></Avatar>
          <div className={styles.company_mobileHead_info}>
            <span className={styles.company_mobileHead_info_name}>{company.name}</span>
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
