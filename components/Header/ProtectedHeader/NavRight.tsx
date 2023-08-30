import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import classNames from 'classnames/bind'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'

import { accessToken, getCookie } from 'helpers/cookies'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { DefaultAvatar } from 'images'
import { useProfileData } from 'app/components/providers/profileProvider'
import { getCountry } from 'helpers/country'

interface IProps {
  langKey: string
  lang: any
  totalUnread: number | string
  handleShowMenu: Function
}

const NavRight = (props: IProps) => {
  const { langKey, lang, totalUnread, handleShowMenu } = props
  const { profile } = useProfileData();
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = getCookie('user')

  const { manageResume, Chat } = lang || {}
  const [showUnCompletedDot, setShowUnCompletedDot] = useState(false)
  const userInfo = useSelector((store: any) => store.users.fetchUserOwnDetail.response || {})

  useEffect(() => {
    if (userInfo?.id) {
      const hasJobPreferences = userInfo?.job_preferences.length > 0
      setShowUnCompletedDot(!userInfo?.is_profile_completed || !hasJobPreferences)
    }
  }, [userInfo])


  const manageProfileCss = {
    height: '40px !important',
    border: '1px solid #2378E5',
    borderRadius: '4px',
    paddingLeft: '23px',
    paddingRight: '23px',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    ':hover': {
      backgroundColor: '#ffffff',
      boxShadow: 'none'
    }
  }
  console.log('vip', userInfo?.vip?.is_vip, { country: getCountry() })
  return (
    <ul className={styles.headerLinksList}>
      <React.Fragment>
        <li className={styles.headerLink} style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            <span className={styles.unread}>{Number(totalUnread) > 99 ? '99+' : totalUnread}</span>
          ) : null}
        </li>
        <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
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
              <MaterialButton variant='contained' capitalize sx={manageProfileCss}>
                <span
                  style={{ color: '#2378E5', whiteSpace: 'nowrap' }}
                  className={showUnCompletedDot ? styles.unCompleted : ''}
                >
                  {manageResume}
                </span>
              </MaterialButton>
            </a>
          ) : (
            <MaterialButton variant='contained' capitalize sx={manageProfileCss}>
              <span
                style={{ color: '#2378E5', whiteSpace: 'nowrap' }}
                className={showUnCompletedDot ? styles.unCompleted : ''}
              >
                {manageResume}
              </span>
            </MaterialButton>
          )}
        </li>
        <li className={styles.headerLink}>
          <div className={styles.profileProtectedWrapper} onClick={() => handleShowMenu()}>
            {userInfo?.vip?.is_vip ?
              <div className={styles.vipAvatar}>
                <Image
                  src={require('./vip_user_icon.png').default.src}
                  width={23}
                  height={9}
                  alt=""
                  style={{ position: 'absolute', bottom: '-1px', right: 0 }} />
                <Image
                  src={profile?.avatar || currentUser?.avatar || DefaultAvatar}
                  className={styles.profilePlaceHolder}
                  width={35}
                  height={35}
                  alt='avatar'
                  onError={(e) => {
                    ; (e.target as HTMLInputElement).src = DefaultAvatar
                  }}
                />
              </div> :
              <Image
                src={profile?.avatar || currentUser?.avatar || DefaultAvatar}
                className={styles.profilePlaceHolder}
                width={35}
                height={35}
                alt='avatar'
                onError={(e) => {
                  ; (e.target as HTMLInputElement).src = DefaultAvatar
                }}
              />}
            <div className={styles.profileCaretWrapper}>
              <div className={styles.profileCaret} />
            </div>
          </div>
        </li>
      </React.Fragment>
    </ul>
  )
}

export default NavRight
