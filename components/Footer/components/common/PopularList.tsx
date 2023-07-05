import React from 'react'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'
import CountryList from './CountryList'
import { getLang } from 'helpers/country'

const PopularList = (props: any) => {

  const {data} = props
  
  const langKey = getLang()

  const {
    ItJobs,
    financeJobs,
    customerService,
    BpoJobs,
    salesJobs,
    healthcareJobs,
  } = data?.foot || {}

  return (
    <ul className={styles.footerDesktopLinkList}>
      <CountryList data={data?.foot || {}} langKey={langKey} />
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/information-technology-jobs?page=1`}
          title='IT jobs'
          external={false}
          aTag={false}
        >
          <span>{ItJobs}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/finance-audit-tax-jobs?page=1`}
          title='Finance jobs'
          external={false}
          aTag={false}
        >
          <span>{financeJobs}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/customer-service-operations-jobs?page=1`}
          title='Customer Service jobs'
          external={false}
          aTag={false}
        >
          <span>{customerService}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/bpo-jobs`}
          title='BPO jobs'
          external={false}
          aTag={false}
        >
          <span>{BpoJobs}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/sales-jobs?page=1`}
          title='Sales jobs'
          external={false}
          aTag={false}
        >
          <span>{salesJobs}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/healthcare-medical-jobs?page=1`}
          title='Healthcare jobs'
          external={false}
          aTag={false}
        >
          <span>{healthcareJobs}</span>
        </Link>
      </li>
    </ul>
  )
}

export default PopularList
