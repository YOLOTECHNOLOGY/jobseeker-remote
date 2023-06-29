import React, { useState, useRef, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import classNames from 'classnames'
import { ChatCircleDots } from 'images'
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
import { BossjobLogo, DefaultAvatar } from 'images'
import Image from 'next/image'
/* Helpers */
import { getCookie } from 'helpers/cookies'
// import { getCountry } from 'helpers/country'
// import { authPathToOldProject } from 'helpers/authenticationTransition'

/* Style */
import styles from '../Header.module.scss'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

// this header will be used when user is logged in
const ProtectedHeader = ({ lang }: any) => {
  const {
    home,
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
    if (userInfo?.id) {
      const hasJobPreferences = userInfo?.job_preferences.length > 0
      setShowUnCompletedDot(!userInfo?.is_profile_completed || !hasJobPreferences)
    }
  }, [userInfo])

  useEffect(() => {
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      dispatch(fetchUserOwnDetailRequest({ accessToken }))
    }
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
            <Image
              width={124}
              height={32}
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
                {pathname != '/' + langKey ? (
                  <Link title='Home' to={'/' + langKey}>
                    <Text textStyle='base' className={styles.headerLinkText}>
                      {home}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    {home}
                  </Text>
                )}
              </li>
              <li className={styles.headerLink}>
                {!pathname?.includes('/jobs-hiring/') ? (
                  <Link title='Jobs' to={'/' + langKey + '/jobs-hiring/job-search'}>
                    <Text textStyle='base' className={styles.headerLinkText}>
                      {findJobs}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
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
                    <Text textStyle='base' className={styles.headerLinkText}>
                      {companies}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    {companies}
                  </Text>
                )}
              </li>

              <li className={styles.headerLink}>
                {!pathname.includes('/talents') ? (
                  <Link title='APP' to={'/' + langKey + '/talents'} aTag>
                    <Text textStyle='base' className={styles.headerLinkText}>
                      APP
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    APP
                  </Text>
                )}
              </li>

              <li className={styles.headerLink} style={{ position: 'relative' }}>
                <Link title='Career Guide' to='https://blog.bossjob.ph' external>
                  <Text textStyle='base' className={styles.headerLinkText}>
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
                  <Text textStyle='base' className={styles.headerLinkText}>
                    {Chat}
                  </Text>
                </Link>
              ) : (
                <Text
                  textStyle='base'
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
                      : router.push('/' + langKey + '/jobseeker-complete-profile')
                    // currentUser?.is_profile_completed ? handleRedirectAuthentication(e, '/dashboard/profile/jobseeker') : router.push('/jobseeker-complete-profile/1')
                  }}
                  style={{ color: '#2378E5' }}
                >
                  <MaterialButton
                    variant='contained'
                    capitalize
                    sx={{
                      height: '40px !important',
                      border: '1px solid #2378E5',
                      borderRadius: '10px',
                      paddingLeft: '23px',
                      paddingRight: '23px',
                      backgroundColor: '#ffffff',
                      ':hover': {
                        backgroundColor: '#ffffff'
                      }
                    }}
                  >
                    <span
                      style={{ color: '#2378E5', whiteSpace: 'nowrap' }}
                      className={showUnCompletedDot ? styles.unCompleted : ''}
                    >
                      {manageResume}
                    </span>
                  </MaterialButton>
                </a>
              ) : (
                <MaterialButton
                  variant='contained'
                  capitalize
                  sx={{
                    height: '40px !important',
                    border: '1px solid #2378E5',
                    borderRadius: '10px',
                    paddingLeft: '23px',
                    paddingRight: '23px',
                    backgroundColor: '#ffffff',
                    ':hover': {
                      backgroundColor: '#ffffff'
                    }
                  }}
                >
                  <span
                    style={{ color: '#2378E5', whiteSpace: 'nowrap' }}
                    className={showUnCompletedDot ? styles.unCompleted : ''}
                  >
                    {manageResume}
                  </span>
                </MaterialButton>
              )}
            </li>
            <li className={styles.headerLink} style={{ width: '90px' }}>
              <div
                className={styles.profileProtectedWrapper}
                onClick={() => setIsShowHeaderMenu(!isShowHeaderMenu)}
              >
                <Image
                  src={currentUser?.avatar || DefaultAvatar}
                  className={styles.profilePlaceHolder}
                  width={35}
                  height={35}
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
                <Image width={32} height={32} src={ChatCircleDots} alt='Chat logo' />
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

              <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSpe}`}>
                <Link
                  to={process.env.BOSSHUNT_URL + '/boss'}
                  aTag
                  external
                  className={styles.headerMenuLink}
                >
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
