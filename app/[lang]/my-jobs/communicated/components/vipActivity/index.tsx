'use client'
import React from 'react'
import { Button } from '@mui/material'

import styles from './index.module.scss'
import Image from 'next/image'

const VipActivity = () => {

  return (
    <div className={styles.vipImage}>
      <Button
        variant='contained'
        className={styles.btn}
      >
        Get VIP for free
      </Button>
      <span className={styles.desc}>Invite friends to get AI resume coaching</span>
      <Image
        src={require('./vip_activity_image.png').default.src}
        width={514}
        height={268}
        alt="vip_activity_image"
      />
    </div>
  )
}
export default VipActivity