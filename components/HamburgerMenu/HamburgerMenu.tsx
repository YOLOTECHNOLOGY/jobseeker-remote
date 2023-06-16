'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'

/* Redux */
import { connect, useSelector } from 'react-redux'
import { logoutRequest } from 'store/actions/auth/logout'
import { toggleMenu } from 'store/actions/navigationBar/toggleMenu'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import SwitchNation from 'components/SwitchNation/SwitchNation'

/* Helpers */
import { getCookie } from 'helpers/cookies'
// import { getCountry } from 'helpers/country'
// import { authPathToOldProject } from 'helpers/authenticationTransition'

import styles from './HamburgerMenu.module.scss'
import { getCountry, getLanguage } from 'helpers/country'

const Divider = () => <div className={styles.divider} />

interface HamburgerMenuProps {
  openState: boolean
  toggleMenu: Function
  lang: Object
}

const HamburgerMenu = ({ openState, toggleMenu, lang }: HamburgerMenuProps) => {
  const { header }: any = lang || {}
  const {
    downloadApp,
    findJobs,
    companies,
    courses,
    careerGuide,
    hiring,
    getStarted,
    manageResume,
    Chat,
    myJobs,
    accountSettings,
    logOut,
    change
  } = header || {}
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const userCookie = getCookie('user')

  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  const [showUnCompletedDot, setShowUnCompletedDot] = useState(false)

  useEffect(() => {
    if(userDetail?.id){
      setShowUnCompletedDot(!userDetail?.is_profile_completed)
    }
  }, [userDetail])

  useEffect(() => {
    setOpenSwitchNationModal(false)
  }, [openState])

  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
  }, [userDetail])

  const handleLogOut = () => {
    // enable body scroll again
    document.body.style.position = ''
    document.body.style.top = ''
    dispatch(logoutRequest())

    if (pathname === '/') {
      location.reload()
    } else {
      router.push('/')
    }
  }

  const handleClick = () => {
    // hide switch nation modal
    if (openSwitchNationModal) {
      setOpenSwitchNationModal(false)
      return
    }

    // enable body scroll again
    document.body.style.position = ''
    document.body.style.top = ''
    toggleMenu()
  }

  const textStyle = 'base'

  return (
    <div className={openState ? [styles.mobileFullPageMenu, styles.open].join(' ') : styles.close}>
      <div className={styles.mobileFullPageMenuContainer}>
        <ul className={styles.menuListWrapper}>
          <React.Fragment>
            <Link
              className={styles.defaultLink}
              to='https://bossjob.ph/app'
              target='_blank'
              title='Bossjob App'
            >
              <li className={styles.menuList}>
                <Text textStyle={textStyle} className={styles.downLoadApp}>
                  {downloadApp}
                </Text>
              </li>
            </Link>
            <Divider />
            <Link className={styles.defaultLink} to='/jobs-hiring/job-search' title='Jobs'>
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle={textStyle}>{findJobs}</Text>
              </li>
            </Link>
            <Link className={styles.defaultLink} to='/companies' title='Companies'>
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle={textStyle}>{companies}</Text>
              </li>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  className={styles.defaultLink}
                  to={
                    userCookie?.is_profile_completed
                      ? '/manage-profile'
                      : '/jobseeker-complete-profile'
                  }
                  // to={userCookie?.is_profile_completed ? authPathToOldProject(null, '/dashboard/profile/jobseeker') : '/jobseeker-complete-profile/1'}
                  // aTag
                  title='Manage Resume'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text
                      textStyle={textStyle}
                      // className={
                      //   styles.activeLink + ' ' + (showUnCompletedDot ? styles.unCompleted : '')
                      // }
                      className={showUnCompletedDot ? styles.unCompleted : ''}
                    >
                      {manageResume}
                    </Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to='/my-jobs?page=1' title='My Jobs'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle}>{myJobs}</Text>
                  </li>
                </Link>
                <Link
                  className={styles.defaultLink}
                  // to={authPathToOldProject(null, '/dashboard/profile/settings')}
                  to='/dashboard/profile/settings'
                  title='Account Settings'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle}>{accountSettings}</Text>
                  </li>
                </Link>
                {/* <Link className={styles.defaultLink} title='Jobs' to='/chat/list'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle}>{Chat}</Text>
                  </li>
                </Link> */}
              </>
            )}
            <Divider />
            <Link
              className={`${styles.defaultLink}`}
              to='https://academy.bossjob.ph/courses/search-courses'
              aTag
              title='Courses'
            >
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle={textStyle}>{courses}</Text>
              </li>
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  className={styles.defaultLink}
                  to='https://blog.bossjob.ph/'
                  external
                  title='Career Guide'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle}>{careerGuide}</Text>
                  </li>
                </Link>
                <Divider />
                <Link
                  className={`${styles.defaultLink}`}
                  to={`${process.env.BOSSHUNT_URL}`}
                  aTag
                  title='Employers'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle}>{hiring}</Text>
                  </li>
                </Link>
                <Divider />
                {/* <Link className={`${styles.defaultLink}`} to='/get-started' title='Get Started'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle} className={styles.activeLink}>
                      {getStarted}
                    </Text>
                  </li>
                </Link> */}

                {/* <li
                  className={styles.defaultLink}
                  onClick={() => {
                    setOpenSwitchNationModal(true)
                  }}
                  style={{ padding: '14px' }}
                >
                  <div className={styles.menuList}>
                    <Text textStyle={textStyle}>
                      {getCountry()}, English - <span style={{ color: '#136FD3' }}>Change</span>
                    </Text>
                  </div>
                </li> */}
              </>
            )}
            {isAuthenticated && (
              <>
                {/* <Link
                  className={styles.defaultLink}
                  to={authPathToOldProject(null, '/dashboard/chat')}
                  aTag
                  title='Chats'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Chats</Text>
                  </li>
                </Link> */}
                {/* <Link
                  className={styles.defaultLink}
                  title='Virtual Career Fair'
                  to={process.env.VCF_CLIENT_URL}
                  aTag
                >
                  <li
                    className={styles.menuList}
                    onClick={handleClick}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Text textStyle='xl'>Virtual Career Fair</Text>
                    <span className={styles.hotTag}>Hot!</span>
                  </li>
                </Link> */}

                {/* <Link
                  className={styles.defaultLink}
                  to={authPathToOldProject(null, '/dashboard/bosspoint')}
                  aTag
                  title='BossPoints'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>BossPoints</Text>
                  </li>
                </Link> */}
                <Link
                  className={styles.defaultLink}
                  to='https://blog.bossjob.ph/'
                  aTag
                  title='Career Guide'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle={textStyle}>{careerGuide}</Text>
                  </li>
                </Link>

                <Divider />

                <Link to={process.env.BOSSHUNT_URL} aTag className={styles.defaultLink}>
                  <li className={styles.menuList}>
                    <Text textStyle='base'>{hiring}</Text>
                  </li>
                </Link>

                <Divider />
                <div className={`${styles.defaultLink}`}>
                  <li className={styles.menuList} onClick={() => handleLogOut()}>
                    <Text textStyle={textStyle}>{logOut}</Text>
                  </li>
                </div>
              </>
            )}
            <Divider />
            <li
              className={styles.defaultLink}
              onClick={() => {
                setOpenSwitchNationModal(true)
              }}
              style={{ padding: '14px' }}
            >
              <div className={styles.menuList}>
                <Text textStyle={textStyle}>
                  {getCountry()}, {getLanguage()} -{' '}
                  <span style={{ color: '#136FD3' }}>{change}</span>
                </Text>
              </div>
            </li>
          </React.Fragment>
        </ul>
      </div>

      {/* switch nation */}
      <SwitchNation
        lang={header}
        open={openSwitchNationModal}
        close={() => setOpenSwitchNationModal(false)}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    openState: state.navbar.toggleMenu.menu
  }
}
const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch(toggleMenu())
})

export default connect(mapStateToProps, mapDispatchToProps)(HamburgerMenu)
