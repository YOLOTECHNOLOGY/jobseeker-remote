import React from 'react'
import Link from 'components/Link'
import { getCountryKey } from 'helpers/country'
import styles from '../../Footer.module.scss'

const CountryList = (props:any) => {

  const { data, langKey } = props
  const countryKey = getCountryKey()
  const { JobsIn1, JobsIn2, JobsIn3 } = data || {}

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

export default CountryList