'use client'
import { useSelector } from 'react-redux'
import styles from '../index.module.scss'

export default function UserAvatar({ avatar }) {
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  if (userDetail?.vip?.is_vip) {
    return (
      <div className={styles.vipAvatar}>
        <img src={require('./vip_user_icon.png').default.src} width="51" height="20" alt='avatar' style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          border: 0
        }} />
        <img className={styles.avatar_img} src={avatar} alt='avatar' />
      </div>
    )
  }
  return (
    <div className={styles.avatar}>
      <img className={styles.avatar_img} src={avatar} alt='avatar' />
    </div>
  )

}