import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import classNames from 'classnames/bind'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'

import { getCookie } from 'helpers/cookies'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { DefaultAvatar } from 'images'

interface IProps {
  langKey: string
  lang: any
  totalUnread: number|string
  handleShowMenu: Function
}

const NavRight = (props: IProps) => {
  const { langKey, lang, totalUnread, handleShowMenu } = props
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
              <MaterialButton
                variant='contained'
                capitalize
                sx={{
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
        <li className={styles.headerLink}>
          <div
            className={styles.profileProtectedWrapper}
            onClick={() => handleShowMenu()}
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
  )
}

export default NavRight
