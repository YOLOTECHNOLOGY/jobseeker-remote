import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'

import { logoutRequest } from 'store/actions/auth/logout'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { BossjobLogo, DefaultAvatar } from 'images'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { authPathToOldProject } from 'helpers/authenticationTransition'

/* Style */
import styles from '../Header.module.scss'

const ProtectedHeader = () => {
  const router = useRouter()
  const currentUser = getCookie('user')
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [isShowHeaderMenu, setIsShowHeaderMenu] = useState(false)

  const handleClickOutside = (event) => {
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

    router.push('/')
  }

  const handleRedirectAuthentication = (e, path) => {
    e.preventDefault()

    const authPath = authPathToOldProject(null, path)
    router.push(authPath)
  }

  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/'}>
            <img
              className={styles.headerLogoImage}
              src={BossjobLogo}
              title='Bossjob logo'
              alt='Bossjob logo'
            />
          </Link>
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                <Link title='Jobs' to='/jobs-hiring/job-search'>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Jobs
                  </Text>
                </Link>
              </li>
              {/* <li className={styles.headerLink}>
                <a
                  title='Headhunt Me'
                  onClick={(e) => handleRedirectAuthentication(e, '/dashboard/headhunt-me')}
                  href='/dashboard/headhunt-me'
                >
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Headhunt Me
                  </Text>
                </a>
              </li> */}
              <li className={styles.headerLink}>
                <Link title='Companies' to='/companies'>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Companies
                  </Text>
                </Link>
              </li>
              {/* <li className={styles.headerLink}>
                <Link title='Courses' to='https://academy.bossjob.ph/courses/search-courses' aTag external>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Courses
                  </Text>
                </Link>
              </li> */}
              {/* <li className={styles.headerLink}>
                <a
                  className={styles.headerLinkIcon}
                  title='Chats'
                  onClick={(e) => handleRedirectAuthentication(e, '/dashboard/chat')}
                  href='/dashboard/chat'
                >
                  <img src={ChatIcon} width='20' height='20' />
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Chats
                  </Text>
                </a>
              </li>
              {/* <li className={styles.headerLink} style={{ position: 'relative' }}>
                <Link title='Virtual Career Fair' to={process.env.VCF_CLIENT_URL} aTag>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Virtual Career Fair
                    <span className={styles.hotTag}>Hot!</span>
                  </Text>
                </Link>
              </li> */}
              <li className={styles.headerLink} style={{ position: 'relative' }}>
                <Link title='Career Guide' to='https://blog.bossjob.ph' external>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Career Guide
                  </Text>
                </Link>
              </li>
            </React.Fragment>
          </ul>
        </div>
        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
              <a
                title='Manage Resume'
                onClick={() => {
                  currentUser?.is_profile_completed
                    ? router.push('/manage-profile')
                    : router.push('/jobseeker-complete-profile/1')
                  // currentUser?.is_profile_completed ? handleRedirectAuthentication(e, '/dashboard/profile/jobseeker') : router.push('/jobseeker-complete-profile/1')
                }}
              >
                <MaterialButton variant='contained' capitalize>
                  <Text textColor='white' textStyle='base' bold>
                    Manage Resume
                  </Text>
                </MaterialButton>
              </a>
            </li>
            <li className={styles.headerLink}>
              <div
                className={styles.profileWrapper}
                onClick={() => setIsShowHeaderMenu(!isShowHeaderMenu)}
              >
                <img
                  src={currentUser?.avatar || DefaultAvatar}
                  className={styles.profilePlaceHolder}
                  alt='avatar'
                  onError={(e) => {
                    ;(e.target as HTMLInputElement).src = DefaultAvatar
                  }}
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
                <Link to='/dashboard/profile/settings' className={styles.headerMenuLink}>
                  <Text textStyle='base'>Account Settings</Text>
                </Link>
              </li>
              <li className={styles.headerMenuItem}>
                <a
                  onClick={(e) => handleRedirectAuthentication(e, '/dashboard/bosspoint')}
                  href='/dashboard/bosspoint'
                  className={styles.headerMenuLink}
                >
                  <Text textStyle='base'>BossPoints</Text>
                </a>
              </li>
              {/* <li className={styles.headerMenuItem}>
                <Link to='https://blog.bossjob.ph/' aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>Career Guide</Text>
                </Link>
              </li> */}
              <li className={styles.headerMenuItem}>
                <Link to={process.env.BOSSHUNT_URL} aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>For Employer</Text>
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
