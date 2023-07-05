import React from 'react'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'
import { getCookie } from 'helpers/cookies'
import { getLang } from 'helpers/country'

const TalentsList = (props: any) => {
  const { data } = props
  const isLogin = getCookie('accessToken') ? true : false

  const langKey = getLang()

  const { allJobs, createFree, careerGuide, courses } = data?.foot || {}

  return (
    <ul className={styles.footerDesktopLinkList}>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/job-search`}
          title='All jobs'
        >
          <span>{allJobs}</span>
        </Link>
      </li>
      {/* <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/jobs-hiring/job-search`}
          title='Create job alert'
        >
          <span>{createJobAlert}</span>
        </Link>
      </li> */}
      <li>
        <Link
          className={styles.footerLink}
          to={isLogin ? `/${langKey}/manage-profile?tab=resume` : `/${langKey}/resumetemplate`}
          title='Create Free Resume'
        >
          <span>{createFree}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to='https://blog.bossjob.ph/category/career-advice/'
          title='Career guide'
          external
        >
          <span>{careerGuide}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to='https://academy.bossjob.ph/courses/search-courses'
          title='Courses'
          external
        >
          <span>{courses}</span>
        </Link>
      </li>
    </ul>
  )
}

export default TalentsList
