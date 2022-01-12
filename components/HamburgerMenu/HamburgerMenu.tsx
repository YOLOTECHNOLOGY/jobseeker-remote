import React, { useEffect } from 'react'
// import { useRouter } from 'next/router'

/* Redux */
import { connect } from 'react-redux'
import { toggleMenu } from 'store/actions/navigationBar/toggleMenu'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'

import styles from './HamburgerMenu.module.scss'

interface HamburgerMenuProps {
  openState: boolean
  toggleMenu: Function
}

const HamburgerMenu = ({ openState, toggleMenu }: HamburgerMenuProps) => {
  // const router = useRouter()

  useEffect(() => {
    //  disable body from scrolling when hamburger menu is open
    const body = document.querySelector('body')
    body.style.overflow = openState ? 'hidden' : 'auto'
  }, [openState])

  return (
    <div className={openState ? [styles.mobileFullPageMenu, styles.open].join(' ') : styles.close}>
      <div className={styles.mobileFullPageMenuContainer}>
        <ul className={styles.menuListWrapper}>
          <React.Fragment>
            <Link className={styles.defaultLink} to='/jobs-hiring/job-search' title='Jobs'>
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Jobs</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to={`${process.env.OLD_PROJECT_URL}/headhunt-me`}
              title='Headhunt Me'
              aTag
            >
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Headhunt Me</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to='https://academy.bossjob.ph/courses/search-courses'
              aTag
              title='Courses'
            >
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Courses</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to='https://blog.bossjob.ph/'
              aTag
              title='Career Guide'
            >
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Career Guide</Text>
              </li>
            </Link>
            <Link
              className={styles.defaultLink}
              to={`${process.env.OLD_PROJECT_URL}/employer`}
              aTag
              title='Employers'
            >
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Employers</Text>
              </li>
            </Link>
            <Link className={styles.defaultLink} to='/' title='Log In'>
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Log In</Text>
              </li>
            </Link>
            <Link className={styles.defaultLink} to='/' title='Sign Up'>
              <li className={styles.menuList} onClick={() => toggleMenu()}>
                <Text textStyle='xl'>Sign Up</Text>
              </li>
            </Link>
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
