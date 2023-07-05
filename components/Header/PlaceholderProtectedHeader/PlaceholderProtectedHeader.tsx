import React, { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'

/* components */
import Text from 'components/Text'
import Link from 'components/Link'
// import Button from 'components/Button'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

import { getCookie } from 'helpers/cookies'

/* Images */
import { BossjobLogo, ChatCircleDots, DefaultAvatar } from 'images'

/* Style */
import styles from '../Header.module.scss'
import MaterialAlert from 'components/MaterialAlert/ index'
import { IMContext } from 'app/[lang]/chat/[chat_id]/components/IMProvider.client'
import { useSelector } from 'react-redux'

type PlaceholderProtectedHeaderProps = {
  isShowEmailAlert: boolean
  lang: any
}

const PlaceholderProtectedHeader = ({
  isShowEmailAlert,
  lang = {}
}: PlaceholderProtectedHeaderProps) => {
  const currentUser = getCookie('user')
  const { totalUnread } = useContext(IMContext)
  const [showUnCompletedDot, setShowUnCompletedDot] = useState(false)
  const userInfo = useSelector((store: any) => store.users.fetchUserOwnDetail.response || {})

  useEffect(() => {
    if(userInfo?.id){
      const hasJobPreferences = userInfo?.job_preferences.length > 0
      setShowUnCompletedDot(!userInfo?.is_profile_completed || !hasJobPreferences)
    }
  }, [userInfo])

  return (
    <>
      {/* {isShowEmailAlert && (
        <MaterialAlert open={true} severity='info'>
          <Text>{lang.pleaseVerify}</Text>
          <a style={{ color: '#1976d2', textDecoration: 'underline rgba(25, 118, 210, 0.4)' }}>
          {lang.verifyNow}
          </a>
        </MaterialAlert>
      )} */}
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
                    {lang.home}
                  </Text>
                </li>
                <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    {lang.findJobs}
                  </Text>
                </li>
                {/* <li className={styles.headerLink}>
                  <a title='Headhunt Me'>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Headhunt Me
                    </Text>
                  </a>
                </li> */}
                <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    {lang.companies}
                  </Text>
                </li>

                {/* <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    {lang.courses}
                  </Text>
                </li> */}

                <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    APP
                  </Text>
                </li>

                <li className={styles.headerLink} style={{ position: 'relative' }}>
                  <Link title='Career Guide' to='https://blog.bossjob.ph' external>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      {lang.careerGuide}
                    </Text>
                  </Link>
                </li>

                {/* <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Courses
                  </Text>
                </li> */}
                {/* <li className={styles.headerLink}>
                  <a className={styles.headerLinkIcon} title='Chats'>
                    <img src={ChatIcon} width='20' height='20' />
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Chats
                    </Text>
                  </a>
                </li> */}
                {/* <li className={styles.headerLink} style={{ position: 'relative' }}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Virtual Career Fair
                    <span className={styles.hotTag}>Hot!</span>
                  </Text>
                </li> */}
              </React.Fragment>
            </ul>
          </div>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li
                className={styles.headerLink}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                  {lang.Chat}
                </Text>
                {totalUnread ? (
                  <span className={styles.unread}>
                    {Number(totalUnread) > 99 ? '99+' : totalUnread}
                  </span>
                ) : null}
              </li>
              <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
                <a title='Manage Resume'>
                  <MaterialButton
                    variant='outlined'
                    size='medium'
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
                    <span className={showUnCompletedDot ? styles.unCompleted : ''} style={{ color: '#2378E5', whiteSpace: 'nowrap' }} >
                      {lang.manageResume}
                    </span>
                  </MaterialButton>
                </a>
              </li>
              <li className={styles.headerLink}>
                <div className={styles.profileWrapper}>
                  <img
                    src={currentUser?.avatar || DefaultAvatar}
                    className={styles.profilePlaceHolder}
                    alt='avatar'
                  />
                  <div className={styles.profileCaret} />
                </div>
              </li>
            </React.Fragment>
          </ul>

          <div className={styles.mobileIconWrapper}>
            <li
              className={styles.headerLink}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                left: 30
              }}
            >
              <>
                <img src={ChatCircleDots} alt='Chat logo' />

                {/* <SmsIcon color='primary' fontSize='large' /> */}
                {totalUnread ? (
                  <span
                    className={styles.unread}
                    style={{ position: 'absolute', bottom: '50%', right: '50%' }}
                  >
                    {Number(totalUnread) > 99 ? '99+' : totalUnread}
                  </span>
                ) : null}
              </>
            </li>
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
