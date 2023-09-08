import React from 'react'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'
import { getCookie } from 'helpers/cookies'
import { getLang } from 'helpers/country'
import { pushToResume } from 'helpers/push'
import { useRouter } from 'next/navigation'

const TalentsList = (props: any) => {
  const { data } = props
  const isLogin = getCookie('accessToken') ? true : false

  const langKey = getLang()
  const router = useRouter()

  const { allJobs, createFree, careerGuide, courses } = data?.foot || {}

  const resumeUrl = process.env.RESUME_TEMP_URL

  const handlePush = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault()
    const url = isLogin ? '/manage-profile?tab=resume' : ''
    isLogin ? router.push(url) : pushToResume(url)
  }

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
          onClick={ev => handlePush(ev)}
          to={isLogin ? `/${langKey}/manage-profile?tab=resume` : `${resumeUrl}`}
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
