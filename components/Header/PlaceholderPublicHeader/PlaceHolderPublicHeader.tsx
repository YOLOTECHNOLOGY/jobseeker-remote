import React from 'react'
import classNames from 'classnames/bind'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Text from 'components/Text'
// import Button from 'components/Button'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { BossjobLogo } from 'images'

const PlaceHolderPublicHeader = () => {
  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
            <img className={styles.headerLogoImage} src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Jobs
                  </Text>
              </li>
              <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Headhunt Me
                  </Text>
              </li>
              <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Companies
                  </Text>
              </li>
              {/* <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Courses
                  </Text>
              </li> */}
              {/* <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Career Guide
                  </Text>
              </li> */}
               <li className={styles.headerLink} style={{ position:'relative' }}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Virtual Career Fair
                    <span className={styles.hotTag}>
                      Hot!
                    </span>
                  </Text>
              </li>
            </React.Fragment>
          </ul>
        </div>
        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                  Employer
                </Text>
            </li>
            <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
                <MaterialButton variant='text' size='medium' capitalize>
                  <Text textStyle='base' textColor='primaryBlue' bold>Log in</Text>
                </MaterialButton>
            </li>
            <li className={styles.headerLink}>
                <MaterialButton variant='outlined' size='medium' capitalize>
                  <Text textStyle='base' textColor='primaryBlue' bold>Sign up</Text>
                </MaterialButton>
            </li>
          </React.Fragment>
        </ul>
        <div className={styles.mobileIconWrapper}>
          <div className={styles.icon}>
            <Hamburger disabled={true}/>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default PlaceHolderPublicHeader
