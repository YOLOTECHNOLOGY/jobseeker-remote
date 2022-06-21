import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

/* Redux */
import { connect } from 'react-redux'
import { logoutRequest } from 'store/actions/auth/logout'
import { toggleMenu } from 'store/actions/navigationBar/toggleMenu'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'

import styles from './HamburgerMenu.module.scss'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { authPathToOldProject } from 'helpers/authenticationTransition'

interface HamburgerMenuProps {
  openState: boolean
  toggleMenu: Function
}

const HamburgerMenu = ({ openState, toggleMenu }: HamburgerMenuProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const userCookie = getCookie('user')

  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
  }, [])

  const handleLogOut = () => {
    // enable body scroll again
    document.body.style.position = ''
    document.body.style.top = ''
    dispatch(logoutRequest())

    router.push('/')
  }

  const handleClick = () => {
    // enable body scroll again
    document.body.style.position = ''
    document.body.style.top = ''
    toggleMenu();
  }

  return (
    <div className={openState ? [styles.mobileFullPageMenu, styles.open].join(' ') : styles.close}>
      <div className={styles.mobileFullPageMenuContainer}>
        <ul className={styles.menuListWrapper}>
          <React.Fragment>
            <Link className={styles.defaultLink} to='/jobs-hiring/job-search' title='Jobs'>
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle='xl'>Jobs</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to={isAuthenticated ? authPathToOldProject(null, '/dashboard/headhunt-me') : `${process.env.OLD_PROJECT_URL}/headhunt-me`}
              title='Headhunt Me'
              aTag
            >
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle='xl'>Headhunt Me</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to='/companies'
              title='Companies'
              aTag
            >
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle='xl'>Companies</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to='https://academy.bossjob.ph/courses/search-courses'
              aTag
              title='Courses'
            >
              <li className={styles.menuList} onClick={handleClick}>
                <Text textStyle='xl'>Courses</Text>
              </li>
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  className={styles.defaultLink}
                  to='https://blog.bossjob.ph/'
                  aTag
                  title='Career Guide'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Career Guide</Text>
                  </li>
                </Link>
                <Link
                  className={styles.defaultLink}
                  to={`${process.env.OLD_PROJECT_URL}/employer`}
                  aTag
                  title='Employers'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Employers</Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to='/login/jobseeker' title='Log In'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Log In</Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to='/register/jobseeker' title='Sign Up'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl' className={styles.activeLink}>Sign Up</Text>
                  </li>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link
                  className={styles.defaultLink}
                  to={authPathToOldProject(null, '/dashboard/chat')}
                  aTag
                  title='Chats'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Chats</Text>
                  </li>
                </Link>
                <Link
                  className={styles.defaultLink}
                  to={userCookie.is_profile_completed ? authPathToOldProject(null, '/dashboard/profile/jobseeker') : '/jobseeker-complete-profile/1'}
                  aTag
                  title='Manage Resume'
                >
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl' className={styles.activeLink}>Manage Resume</Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to='/my-jobs/saved?page=1' title='My Jobs'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>My Jobs</Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to={authPathToOldProject(null, '/dashboard/profile/settings')} aTag title='Account Settings'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Account Settings</Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to={authPathToOldProject(null, '/dashboard/bosspoint')} aTag title='BossPoints'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>BossPoints</Text>
                  </li>
                </Link>
                <Link className={styles.defaultLink} to='https://blog.bossjob.ph/' aTag title='Career Guide'>
                  <li className={styles.menuList} onClick={handleClick}>
                    <Text textStyle='xl'>Career Guide</Text>
                  </li>
                </Link>

                <div className={styles.defaultLink}>
                  <li className={styles.menuList} onClick={() => handleLogOut()}>
                    <Text textStyle='xl'>Log Out</Text>  
                  </li>
                </div>
              </>
            )}
          </React.Fragment>
        </ul>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    openState: state.navbar.toggleMenu.menu,
  }
}
const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch(toggleMenu()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HamburgerMenu)
