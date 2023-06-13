import React, { useState, useRef, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import classNames from 'classnames'
import { HomePageChat as ChatCircleDots } from 'images'
import { logoutRequest } from 'store/actions/auth/logout'
import { useSelector } from 'react-redux'
/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'
import { IMContext } from 'app/[lang]/chat/[chat_id]/components/IMProvider.client'
import SwitchNation from 'components/SwitchNation/SwitchNation'
import { getLanguage, getCountryId } from 'helpers/country'
import { getValueById } from 'helpers/config/getValueById'
import { getLang } from 'helpers/country'
/* Images */
import { BossjobLogoWhite as BossjobLogo, DefaultAvatar } from 'images'

/* Helpers */
import { getCookie } from 'helpers/cookies'
// import { getCountry } from 'helpers/country'
// import { authPathToOldProject } from 'helpers/authenticationTransition'

/* Style */
import styles from '../Header.module.scss'

// this header will be used when user is logged in
const ProtectedHeader = ({ lang }: any) => {
  const {
    careerGuide,
    companies,
    courses,
    findJobs,
    hiring,
    manageResume,
    myJobs,
    accountSettings,
    logOut,
    Chat,
    change
  } = lang || {}
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = getCookie('user')
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [isShowHeaderMenu, setIsShowHeaderMenu] = useState(false)
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const [showUnCompletedDot, setShowUnCompletedDot] = useState(false)
  const { totalUnread } = useContext(IMContext)
  const userInfo = useSelector((store: any) => store.users.fetchUserOwnDetail.response || {})
  // const totalUnread = 999
  const config = useSelector((store: any) => store.config.config.response)
  const langKey = getLang()
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
    userInfo && setShowUnCompletedDot(!userInfo?.is_profile_completed)
  }, [userInfo])

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
  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/' + langKey}>
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
                  <Link title='Jobs' to={'/' + langKey + '/jobs-hiring/job-search'}>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      {findJobs}
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
                    {findJobs}
                  </Text>
                )}
              </li>
              <li className={styles.headerLink}>
                {!pathname.includes('/companies') ? (
                  <Link title='Companies' to={'/' + langKey + '/companies'}>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      {companies}
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
                    {companies}
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
                    {courses}
                  </Text>
                </Link>
              </li>

              <li className={styles.headerLink} style={{ position: 'relative' }}>
                <Link title='Career Guide' to='https://blog.bossjob.ph' external>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    {careerGuide}
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
                <Link title='Jobs' to={'/' + langKey + '/chat/list'}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    {Chat}
                  </Text>
                </Link>
              ) : (
                <Text
                  textStyle='base'
                  textColor='darkGrey'
                  className={classNames([styles.headerLinkText, styles.headerLinkTextCurrentPage])}
                >
                  {Chat}
                </Text>
              )}
              {totalUnread ? (
                <span className={styles.unread}>
                  {Number(totalUnread) > 99 ? '99+' : totalUnread}
                </span>
              ) : null}
            </li>
            <li
              className={classNames([styles.headerLink, styles.headerLinkLogin])}
              style={{ width: '150px' }}
            >
              {!pathname.includes('/manage-profile') ? (
                <a
                  title='Manage Resume'
                  onClick={() => {
                    currentUser?.is_profile_completed
                      ? router.push('/' + langKey + '/manage-profile')
                      : router.push('/' + langKey + '/jobseeker-complete-profile/1')
                    // currentUser?.is_profile_completed ? handleRedirectAuthentication(e, '/dashboard/profile/jobseeker') : router.push('/jobseeker-complete-profile/1')
                  }}
                  style={{ color: '#353535' }}
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
                    <Text
                      textColor='white'
                      textStyle='base'
                      className={showUnCompletedDot ? styles.unCompleted : ''}
                    >
                      {manageResume}
                    </Text>
                  </MaterialButton>
                </a>
              ) : (
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
                  <Text
                    textColor='white'
                    textStyle='base'
                    className={showUnCompletedDot ? styles.unCompleted : ''}
                  >
                    {manageResume}
                  </Text>
                </MaterialButton>
              )}
            </li>
            <li className={styles.headerLink} style={{ width: '90px' }}>
              <div
                className={styles.profileProtectedWrapper}
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
          {!pathname.includes('/chat/[chat_id]') ? (
            <li
              className={styles.headerLink}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                left: 30
                // top: 5
              }}
            >
              <Link title='Jobs' to={'/' + langKey + '/chat/list'}>
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
          <div className={styles.icon} onClick={() => setOpenSwitchNationModal(false)}>
            <Hamburger />
          </div>
        </div>

        {isShowHeaderMenu && (
          <div className={styles.headerMenu} ref={ref}>
            <ul className={styles.headerMenuList}>
              <li className={styles.headerMenuItem}>
                <Link to={'/' + langKey + '/my-jobs?page=1'} className={styles.headerMenuLink}>
                  <Text textStyle='base'>{myJobs}</Text>
                </Link>
              </li>
              <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSet}`}>
                <Link to='/dashboard/profile/settings' className={styles.headerMenuLink}>
                  <Text textStyle='base'>{accountSettings}</Text>
                </Link>
              </li>

              <li className={styles.headerMenuItem}>
                <Link to={process.env.BOSSHUNT_URL} aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>{hiring}</Text>
                </Link>
              </li>

              <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSpe}`}>
                <Link to={process.env.BOSSHUNT_URL} aTag external className={styles.headerMenuLink}>
                  <Text textStyle='base'>{hiring}</Text>
                </Link>
              </li>
              <li
                className={`${styles.headerMenuItem} ${styles.headerMenuItemSpe}`}
                onClick={() => {
                  setOpenSwitchNationModal(true)
                  setIsShowHeaderMenu(false)
                }}
              >
                <div className={styles.headerMenuLink}>
                  <Text textStyle='base'>
                    {getValueById(config, getCountryId(), 'country_id')}, {getLanguage()} -{' '}
                    <span style={{ color: '#136FD3' }}>{change}</span>
                  </Text>
                </div>
              </li>

              <li className={styles.headerMenuItem}>
                <div className={styles.headerMenuLink} onClick={() => handleLogOut()}>
                  <Text textStyle='base'>{logOut}</Text>
                </div>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* switch nation */}
      <SwitchNation
        open={openSwitchNationModal}
        lang={lang}
        close={() => setOpenSwitchNationModal(false)}
      />
    </div>
  )
}

export default ProtectedHeader
