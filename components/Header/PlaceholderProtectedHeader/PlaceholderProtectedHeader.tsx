import React from 'react'
import classNames from 'classnames/bind'

/* components */
import Text from 'components/Text'
// import Button from 'components/Button'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { BossjobLogo, DefaultAvatar, ChatIcon } from 'images'

/* Style */
import styles from '../Header.module.scss'
import MaterialAlert from '../../MaterialAlert/ index'

type PlaceholderProtectedHeaderProps = {
  isShowEmailAlert: boolean
}

const PlaceholderProtectedHeader = ({ isShowEmailAlert }: PlaceholderProtectedHeaderProps) => {
  return (
    <>
      {isShowEmailAlert && (
        <MaterialAlert open={true} severity='info'>
          <Text>
            Please verify your email address.{' '}
          </Text>
          <a style={{ color:"#1976d2", textDecoration: 'underline rgba(25, 118, 210, 0.4)'}}>
            Verify now.
          </a>
        </MaterialAlert>
      )}
      <div className={styles.header}>
        <nav className={styles.headerContainer}>
          <div className={styles.headerLogo}>
            <img
              className={styles.headerLogoImage}
              src={BossjobLogo}
              title='Bossjob logo'
              alt='Bossjob logo'
            />
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
                  <a title='Headhunt Me'>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Headhunt Me
                    </Text>
                  </a>
                </li>
                <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Companies
                  </Text>
                </li>
                <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Courses
                  </Text>
                </li>
                <li className={styles.headerLink}>
                  <a className={styles.headerLinkIcon} title='Chats'>
                    <img src={ChatIcon} width='20' height='20' />
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Chats
                    </Text>
                  </a>
                </li>
                <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Career Guide
                  </Text>
                </li>
                {/* <li className={styles.headerLink} style={{ position:'relative' }}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Virtual Career Fair
                    <span className={styles.hotTag}>
                      Hot!
                    </span>
                  </Text>
                </li> */}
              </React.Fragment>
            </ul>
          </div>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
                <a title='Manage Resume'>
                  <MaterialButton variant='contained' capitalize>
                    <Text textColor='white' textStyle='base' bold>
                      Manage Resume
                    </Text>
                  </MaterialButton>
                </a>
              </li>
              <li className={styles.headerLink}>
                <div className={styles.profileWrapper}>
                  <img src={DefaultAvatar} className={styles.profilePlaceHolder} alt='avatar' />
                  <div className={styles.profileCaret} />
                </div>
              </li>
            </React.Fragment>
          </ul>
          <div className={styles.mobileIconWrapper}>
            <div className={styles.icon}>
              <Hamburger disabled={true} />
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default PlaceholderProtectedHeader
