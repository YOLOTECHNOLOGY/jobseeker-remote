import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames/bind'
import Image from 'next/image'

import { logoutRequest } from 'store/actions/auth/logout'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import Button from 'components/Button'
import Hamburger from 'components/Hamburger'

/* Images */
import { BossjobLogo, DefaultJobseekerAvatar, ChatIcon } from 'images'

/* Helpers */
import { getCookie } from 'helpers/cookies'

/* Style */
import styles from '../Header.module.scss'

const ProtectedHeader = () => {
  const currentUser = getCookie('user')
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [isShowHeaderMenu, setIsShowHeaderMenu] = useState(false)

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsShowHeaderMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const handleLogOut = () => {
    dispatch(logoutRequest())
  }

  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/'}>
            <img id={styles.logo} src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
          </Link>
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                <Link title='Jobs' to='/jobs-hiring/job-search'>
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>
                    Jobs
                  </Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link title='Headhunt Me' to={`${process.env.OLD_PROJECT_URL}/headhunt-me`}>
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>
                    Headhunt Me
                  </Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link title='Companies' to='/companies'>
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>
                    Companies
                  </Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link title='Courses' to='https://academy.bossjob.ph/courses/search-courses' aTag external>
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>
                    Courses
                  </Text>
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link className={styles.headerLinkIcon} title='Chats' to='/'>
                  <Image src={ChatIcon} width='20' height='20' />
                  <Text textStyle='sm' textColor='darkGrey' className={styles.headerLinkText}>
                    Chats
                  </Text>
                </Link>
              </li>
            </React.Fragment>
          </ul>
        </div>
        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
              <Link title='Manage Resume' to='/jobseeker-complete-profile/1'>
                <Button primary>Manage Resume</Button>
              </Link>
            </li>
            <li className={styles.headerLink}>
              <div className={styles.profileWrapper} onClick={() => setIsShowHeaderMenu(!isShowHeaderMenu)}>
                <img
                  src={currentUser?.avatar || DefaultJobseekerAvatar}
                  className={styles.profilePlaceHolder}
                  alt='avatar'
                />
                <div className={styles.profileCaret} />
              </div>
            </li>
          </React.Fragment>
        </ul>
        <div className={styles.mobileIconWrapper}>
          <div className={styles.icon}>
            <Hamburger />
          </div>
        </div>

        {isShowHeaderMenu && (
          <div className={styles.headerMenu} ref={ref}>
            <ul className={styles.headerMenuList}>
              <li className={styles.headerMenuItem}>
                <Link to='/my-jobs/saved?page=1' className={styles.headerMenuLink}>
                  <Text textStyle='base'>My Jobs</Text>  
                </Link>
              </li>
              <li className={styles.headerMenuItem}>
                <Link to='/' className={styles.headerMenuLink}>
                  <Text textStyle='base'>Account Settings</Text>  
                </Link>
              </li>
              <li className={styles.headerMenuItem}>
                <Link to='/' className={styles.headerMenuLink}>
                  <Text textStyle='base'>BossPoints</Text>  
                </Link>
              </li>
              <li className={styles.headerMenuItem}>
                <Link to='https://blog.bossjob.ph/' aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>Career Guide</Text>  
                </Link>
              </li>
              <li className={styles.headerMenuItem}>
                <div className={styles.headerMenuLink} onClick={() => handleLogOut()}>
                  <Text textStyle='base'>Log Out</Text>  
                </div>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  )
}

export default ProtectedHeader
