import React from 'react'
import classNames from 'classnames/bind'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import Button from 'components/Button'

/* Images */
import { BossjobLogo } from 'images'

const PublicHeader = () => {
  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/'}>
            <img
              id={styles.logo}
              src={BossjobLogo}
              title="Bossjob logo"
              alt="Bossjob logo"
            />
          </Link>
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                <Link
                  title='Jobs'
                  to='/jobs-hiring/job-search'
                >
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Jobs</Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link
                  title='Headhunt Me'
                  to={`${process.env.OLD_PROJECT_URL}/headhunt-me`}
                  aTag
                >
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Headhunt Me</Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link
                  title='Courses'
                  to="https://academy.bossjob.ph/courses/search-courses"
                  aTag                  
                >
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Courses</Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link
                  title='Career Guide'
                  to='https://blog.bossjob.ph/'
                  aTag
                >
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Career Guide</Text>
                </Link>
              </li>
            </React.Fragment>
          </ul>
        </div>
        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={styles.headerLink}>
              <Link
                title='Employer'
                to={`${process.env.OLD_PROJECT_URL}/employer`}
                aTag
              >
                <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Employer</Text>
              </Link>
            </li>
            <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
              <Link
                title='Login'
                to='/'
              >
                <Button>Log in</Button>
              </Link>
            </li>
            <li className={styles.headerLink}>
              <Link
                title='Signup'
                to='/'
              >
                <Button primary>Sign up</Button>
              </Link>
            </li>
          </React.Fragment>
        </ul>
      </nav>
    </div>
  )
}

export default PublicHeader
