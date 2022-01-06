import React from 'react'
import classNames from 'classnames/bind'
import Image from 'next/image'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import Button from 'components/Button'

/* Images */
import { BossjobLogo, DefaultJobseekerAvatar, ChatIcon } from 'images'

const ProtectedHeader = () => {
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
                  to='/'
                >
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Headhunt Me</Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link
                  title='Courses'
                  to='/'
                >
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Courses</Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link
                  className={styles.headerLinkIcon}
                  title='Chats'
                  to='/'
                >
                  <Image src={ChatIcon} width='20' height='20' />
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>Chats</Text>
                </Link>
              </li>
            </React.Fragment>
          </ul>
        </div>
        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
              <Link
                title='Manage Me'
                to='/'
              >
                <Button primary>Manage Resume</Button>
              </Link>
            </li>
            <li className={styles.headerLink}>
              <div>
                <div>
                  <div
                    className={styles.profileWrapper}
                  >
                    <img
                      src={DefaultJobseekerAvatar}
                      className={styles.profilePlaceHolder}
                      alt="avatar"
                    />
                    <div className={styles.profileCaret}/>
                  </div>
                </div>
              </div>
            </li>
          </React.Fragment>
        </ul>
      </nav>
    </div>
  )
}

export default ProtectedHeader
