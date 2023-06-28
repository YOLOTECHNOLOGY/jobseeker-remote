import React from 'react'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'
import { getCountryKey } from 'helpers/country'


const CountryList = (data) => {
  const countryKey = getCountryKey()
  const { JobsIn1, JobsIn2, JobsIn3 } = data?.lang || {}
  const langKey = data.langKey
  const COUNTRY_MAP = {
    ph: [
      {
        to: `${langKey}/jobs-hiring/manila-jobs`,
        title: JobsIn1
      },
      {
        to: `${langKey}/jobs-hiring/makati-jobs`,
        title: JobsIn2
      },
      {
        to: `${langKey}/jobs-hiring/cebu-jobs`,
        title: JobsIn3
      }
    ],
    sg: [
      {
        to: `${langKey}/jobs-hiring/downtown-core-jobs`,
        title: JobsIn1
      },
      {
        to: `${langKey}/jobs-hiring/kallang-jobs`,
        title: JobsIn2
      },
      {
        to: `${langKey}/jobs-hiring/jurong-east-jobs`,
        title: JobsIn3
      }
    ]
  }
  const currentCounties = COUNTRY_MAP[countryKey]

  return (
    <>
      {currentCounties.map((country) => {
        return (
          <li key={country.title}>
            <Link
              className={styles.footerLink}
              to={country.to}
              title={country.title}
              external={false}
              aTag={false}
            >
              <span>{country.title}</span>
            </Link>
          </li>
        )
      })}
    </>
  )
}

const PopularJobsLink = (props) => {
  const { data, langKey, lang } = props
  const {
    popularJobs,
    ItJobs,
    financeJobs,
    customerService,
    BpoJobs,
    salesJobs,
    healthcareJobs,
  } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{popularJobs}</div>
      <ul className={styles.footerDesktopLinkList}>
        <CountryList lang={lang?.foot || {}} langKey={langKey} />
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
    </>
  )
}

export default PopularJobsLink
