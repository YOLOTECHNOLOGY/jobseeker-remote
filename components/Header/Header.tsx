import React from 'react'

/* Style */
import styles from './Header.module.scss'

/* components */
import Link from 'components/Link'

const Header = () => {
  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/'}>
            Home/Logo
          </Link>
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                <Link
                  title='Link 1'
                  to='/'
                >
                  Link 1
                </Link>
              </li>
              <li className={styles.headerLink}>
                <Link
                  title='Link 2'
                  to='/'
                >
                  Link 2
                </Link>
              </li>
            </React.Fragment>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Header
