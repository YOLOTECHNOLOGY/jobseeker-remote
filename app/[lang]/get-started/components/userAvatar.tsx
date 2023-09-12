'use client'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'

import styles from '../index.module.scss'
import { useEffect, useState } from 'react'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

export default function UserAvatar({ avatar, isModal, loginData }) {
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  const searchParams = useSearchParams()
  const [isVip, setIsVip] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    if (isModal) {
      setIsVip(Boolean(loginData?.vip?.is_vip))
    }
  }, [JSON.stringify(loginData?.vip), isModal])

  if (isVip || userDetail?.vip?.is_vip || Number(searchParams.get('is_vip'))) {
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