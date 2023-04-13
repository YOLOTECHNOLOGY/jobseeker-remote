import React, { useState, useRef, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import classNames from 'classnames'
import { HomePageChat as ChatCircleDots } from 'images'
import { logoutRequest } from 'store/actions/auth/logout'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { BossjobLogoWhite as BossjobLogo, DefaultAvatar } from 'images'

/* Helpers */
import { getCookie } from 'helpers/cookies'
// import { authPathToOldProject } from 'helpers/authenticationTransition'

/* Style */
import styles from '../Header.module.scss'
import { IMContext } from 'components/Chat/IMProvider.client'
import { getCountryKey } from 'helpers/country'

// this header will be used when user is logged in
const ProtectedHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = getCookie('user')
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [isShowHeaderMenu, setIsShowHeaderMenu] = useState(false)
  const { totalUnread } = useContext(IMContext)
  // const totalUnread = 999

  useEffect(() => {
    if (pathname && isShowHeaderMenu) {
      setIsShowHeaderMenu(false)
    }
  }, [pathname])

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
    if (pathname === '/') {
      location.reload()
    } else {
      router.push('/')
    }
  }

  // const handleRedirectAuthentication = (e, path) => {
  //   e.preventDefault()

  //   const authPath = authPathToOldProject(null, path)
  //   router.push(authPath)
  // }
  const countryKey = getCountryKey()
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
              style={{
                marginTop: '3px'
              }}
            />
          </Link>
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                {!pathname?.includes('/jobs-hiring/') ? (
                  <Link title='Jobs' to='/jobs-hiring/job-search'>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Find Jobs
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    textColor='darkGrey'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    Find Jobs
                  </Text>
                )}
              </li>
              <li className={styles.headerLink}>
                {pathname !== '/companies' ? (
                  <Link title='Companies' to='/companies'>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Companies
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    textColor='darkGrey'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    Companies
                  </Text>
                )}
              </li>

              <li className={styles.headerLink} style={{ position: 'relative' }}>
                <Link
                  title='Courses'
                  to='https://academy.bossjob.ph/courses/search-courses'
                  external
                >
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Courses
                  </Text>
                </Link>
              </li>

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
            <li
              className={styles.headerLink}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              {pathname !== '/chat/[chat_id]' ? (
                <Link title='Jobs' to='/chat/list'>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Chat
                  </Text>
                </Link>
              ) : (
                <Text
                  textStyle='base'
                  textColor='darkGrey'
                  className={classNames([styles.headerLinkText, styles.headerLinkTextCurrentPage])}
                >
                  Chat
                </Text>
              )}
              {totalUnread ? (
                <span className={styles.unread}>
                  {Number(totalUnread) > 99 ? '99+' : totalUnread}
                </span>
              ) : null}
            </li>
            <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
              {pathname !== '/manage-profile' ? (
                <a
                  title='Manage Resume'
                  onClick={() => {
                    currentUser?.is_profile_completed
                      ? router.push('/manage-profile')
                      : router.push('/jobseeker-complete-profile/1')
                    // currentUser?.is_profile_completed ? handleRedirectAuthentication(e, '/dashboard/profile/jobseeker') : router.push('/jobseeker-complete-profile/1')
                  }}
                >
                  <MaterialButton
                    variant='contained'
                    capitalize
                    sx={{
                      width: '150px',
                      height: '35px !important',
                      border: '1.5px solid #FFFFFF',
                      borderRadius: '10px',
                      maxWidth: '153px',
                      paddingLeft: '0',
                      paddingRight: '0',
                      backgroundColor: '#136FD3',
                      ':hover': {
                        backgroundColor: '#136FD3'
                      }
                    }}
                  >
                    <Text textColor='white' textStyle='base'>
                      Manage Resume
                    </Text>
                  </MaterialButton>
                </a>
              ) : (
                <MaterialButton
                  variant='contained'
                  capitalize
                  sx={{
                    width: '123px',
                    height: '35px !important',
                    border: '1.5px solid #FFFFFF',
                    borderRadius: '10px',
                    maxWidth: '153px',
                    paddingLeft: '0',
                    paddingRight: '0',
                    backgroundColor: '#136FD3',
                    ':hover': {
                      backgroundColor: '#136FD3'
                    }
                  }}
                >
                  <Text textColor='white' textStyle='base'>
                    Manage Resume
                  </Text>
                </MaterialButton>
              )}
            </li>
            <li className={styles.headerLink}>
              <div
                className={styles.profileProtectedWrapper}
                onClick={() => setIsShowHeaderMenu(!isShowHeaderMenu)}
              >
                <img
                  src={currentUser?.avatar || DefaultAvatar}
                  className={styles.profilePlaceHolder}
                  alt='avatar'
                  onError={(e) => {
                    ; (e.target as HTMLInputElement).src = DefaultAvatar
                  }}
                />
                <div className={styles.profileCaret} />
              </div>
            </li>
          </React.Fragment>
        </ul>
        <select
          onChange={(e) => {
            const value = e.target.value
            // console.log({ onChange: e.target.value })
            if (value === countryKey) {
              return
            }
            const accessToken = getCookie('accessToken')
            const url = 'https://dev.bossjob.' + value + '/changeLocale?accessToken=' + accessToken
            window.location.href = url
          }}
          value={countryKey}
        >
          <option value='ph' label='PH' />
          <option value='sg' label='SGP' />
        </select>
        <div className={styles.mobileIconWrapper}>
          {pathname !== '/chat/[chat_id]' ? (
            <li
              className={styles.headerLink}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                left: 20
                // top: 5
              }}
            >
              <Link title='Jobs' to='/chat/list'>
                <img src={ChatCircleDots} alt='Chat logo' />
                {totalUnread ? (
                  <span
                    className={styles.unread}
                    style={{ position: 'absolute', bottom: '50%', right: '50%' }}
                  >
                    {Number(totalUnread) > 99 ? '99+' : totalUnread}
                  </span>
                ) : null}
              </Link>
            </li>
          ) : null}
          <div className={styles.icon}>
            <Hamburger />
          </div>

        </div>

        {isShowHeaderMenu && (
          <div className={styles.headerMenu} ref={ref}>
            <ul className={styles.headerMenuList}>
              <li className={styles.headerMenuItem}>
                <Link to='/my-jobs?page=1' className={styles.headerMenuLink}>
                  <Text textStyle='base'>My Jobs</Text>
                </Link>
              </li>
              <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSet}`}>
                <Link to='/dashboard/profile/settings' className={styles.headerMenuLink}>
                  <Text textStyle='base'>Account Settings</Text>
                </Link>
              </li>
              {/* <li className={styles.headerMenuItem}>
                <a
                  onClick={(e) => handleRedirectAuthentication(e, '/dashboard/bosspoint')}
                  href='/dashboard/bosspoint'
                  className={styles.headerMenuLink}
                >
                  <Text textStyle='base'>BossPoints</Text>
                </a>
              </li> */}
              {/* <li className={styles.headerMenuItem}>
                <Link to='https://blog.bossjob.ph/' aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>Career Guide</Text>
                </Link>
              </li> */}
              <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSpe}`}>
                <Link to={process.env.BOSSHUNT_URL} aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>I’m hiring</Text>
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
